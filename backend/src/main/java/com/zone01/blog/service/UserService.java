package com.zone01.blog.service;

import com.zone01.blog.dto.FollowRequestResponse;
import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.entity.FollowRequest;
import com.zone01.blog.entity.User;
import com.zone01.blog.entity.UserRole;
import com.zone01.blog.repository.FollowRequestRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FollowRequestRepository followRequestRepository;
    private final AvatarService avatarService;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository userRepository, 
                       NotificationService notificationService,
                       FollowRequestRepository followRequestRepository,
                       AvatarService avatarService,
                       FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.followRequestRepository = followRequestRepository;
        this.avatarService = avatarService;
        this.fileStorageService = fileStorageService;
    }

    // readOnly keeps session open for lazy-loaded collections (followers/following)
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String targetUsername, String currentViewerUsername) {
        User user = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUsername));

        int followersCount = user.getFollowers().size();
        int followingCount = user.getFollowing().size();

        boolean isFollowing = false;
        boolean hasPendingRequest = false;
        if (currentViewerUsername != null && !currentViewerUsername.equals(targetUsername)) {
            User currentViewer = userRepository.findByUsername(currentViewerUsername).orElse(null);
            if (currentViewer != null) {
                isFollowing = currentViewer.getFollowing().stream()
                        .anyMatch(u -> java.util.Objects.equals(u.getId(), user.getId()));
                hasPendingRequest = followRequestRepository.existsByRequesterAndTarget(currentViewer, user);
            }
        }

        boolean isOwnProfile = currentViewerUsername != null && currentViewerUsername.equals(targetUsername);
        boolean isAdmin = false;
        if (currentViewerUsername != null) {
            User currentViewer = userRepository.findByUsername(currentViewerUsername).orElse(null);
            if (currentViewer != null) {
                isAdmin = currentViewer.getRole() == UserRole.ROLE_ADMIN;
            }
        }
        String displayEmail = (isOwnProfile || isAdmin) ? user.getEmail() : null;

        String avatarUrl = user.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isBlank()) {
            avatarUrl = avatarService.getFallbackAvatarForUsername(user.getUsername());
        }

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                displayEmail,
                user.getRole(),
                user.getCreatedAt(),
                followersCount,
                followingCount,
                isFollowing,
                user.isPrivateProfile(),
                hasPendingRequest,
                avatarUrl
        );
    }

    // Search users by partial username
    @Transactional(readOnly = true)
    public List<UserProfileResponse> searchUsers(String query, String currentViewerUsername) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<User> users = userRepository.findByUsernameContainingIgnoreCase(query.trim());
        User currentViewer = currentViewerUsername != null 
                ? userRepository.findByUsername(currentViewerUsername).orElse(null) 
                : null;
        boolean isAdminViewer = currentViewer != null && currentViewer.getRole() == UserRole.ROLE_ADMIN;

        return users.stream().map(user -> {
            boolean isFollowing = false;
            boolean hasPendingRequest = false;
            if (currentViewer != null && !currentViewer.getId().equals(user.getId())) {
                isFollowing = currentViewer.getFollowing().stream()
                        .anyMatch(u -> java.util.Objects.equals(u.getId(), user.getId()));
                hasPendingRequest = followRequestRepository.existsByRequesterAndTarget(currentViewer, user);
            }
            String displayEmail = (user.getUsername().equals(currentViewerUsername) || isAdminViewer) ? user.getEmail() : null;
            String avatarUrl = user.getAvatarUrl();
            if (avatarUrl == null || avatarUrl.isBlank()) {
                avatarUrl = avatarService.getFallbackAvatarForUsername(user.getUsername());
            }
            return new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    displayEmail,
                    user.getRole(),
                    user.getCreatedAt(),
                    user.getFollowers().size(),
                    user.getFollowing().size(),
                    isFollowing,
                    user.isPrivateProfile(),
                    hasPendingRequest,
                    avatarUrl
            );
        }).collect(Collectors.toList());
    }

    // Toggle or explicitly update private profile visibility
    @Transactional
    public UserProfileResponse updateProfilePrivacy(String username, Boolean explicitPrivacy) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        if (user.isBanned()) {
            throw new SecurityException("Banned accounts cannot change profile privacy.");
        }
        boolean newStatus = (explicitPrivacy != null) ? explicitPrivacy : !user.isPrivateProfile();

        // If switching from private to public, auto-approve pending follow requests
        if (user.isPrivateProfile() && !newStatus) {
            List<FollowRequest> pending = followRequestRepository.findByTargetOrderByCreatedAtDesc(user);
            for (FollowRequest req : pending) {
                req.getRequester().follow(user);
                userRepository.save(req.getRequester());
                notificationService.notifyFollowAccepted(req.getRequester(), user);
            }
            followRequestRepository.deleteAll(pending);
        }

        user.setPrivateProfile(newStatus);
        User saved = userRepository.save(user);

        String avatarUrl = saved.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isBlank()) {
            avatarUrl = avatarService.getFallbackAvatarForUsername(saved.getUsername());
        }

        return new UserProfileResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getRole(),
                saved.getCreatedAt(),
                saved.getFollowers().size(),
                saved.getFollowing().size(),
                false,
                saved.isPrivateProfile(),
                false,
                avatarUrl
        );
    }

    // Handle subscribing: if private profile, send or cancel follow request; if public, follow immediately
    @Transactional
    public Map<String, Object> subscribe(String currentUsername, String targetUsername) {
        if (currentUsername.equals(targetUsername)) {
            throw new IllegalArgumentException("You cannot subscribe to yourself");
        }

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));
        if (currentUser.isBanned()) {
            throw new SecurityException("Banned accounts cannot subscribe to users.");
        }
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUsername));

        // Case 1: Target has a private profile
        if (targetUser.isPrivateProfile()) {
            if (currentUser.getFollowing().contains(targetUser)) {
                return Map.of("message", "Already following @" + targetUsername, "following", true, "requested", false);
            }

            var existingRequest = followRequestRepository.findByRequesterAndTarget(currentUser, targetUser);
            if (existingRequest.isPresent()) {
                followRequestRepository.delete(existingRequest.get());
                return Map.of("message", "Follow request cancelled", "following", false, "requested", false);
            } else {
                FollowRequest followRequest = new FollowRequest(currentUser, targetUser);
                followRequestRepository.save(followRequest);
                notificationService.notifyFollowRequest(targetUser, currentUser);
                return Map.of("message", "Follow request sent to @" + targetUsername, "following", false, "requested", true);
            }
        }

        // Case 2: Target has a public profile -> follow immediately
        currentUser.follow(targetUser);
        userRepository.save(currentUser);

        // Notify the followed student that they have a new follower
        notificationService.notifyNewFollower(targetUser, currentUser);
        return Map.of("message", "Subscribed to @" + targetUsername, "following", true, "requested", false);
    }

    // Unsubscribe from a user (also cancels any pending follow request)
    @Transactional
    public void unsubscribe(String currentUsername, String targetUsername) {
        if (currentUsername.equals(targetUsername)) {
            throw new IllegalArgumentException("You cannot unsubscribe from yourself");
        }

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));
        if (currentUser.isBanned()) {
            throw new SecurityException("Banned accounts cannot perform social actions.");
        }
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUsername));

        // Cancel any pending request if present
        followRequestRepository.findByRequesterAndTarget(currentUser, targetUser)
                .ifPresent(followRequestRepository::delete);

        currentUser.unfollow(targetUser);
        userRepository.save(currentUser);
    }

    // List pending follow requests for the authenticated user
    @Transactional(readOnly = true)
    public List<FollowRequestResponse> getPendingRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        return followRequestRepository.findByTargetOrderByCreatedAtDesc(user).stream()
                .map(FollowRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Accept an incoming follow request
    @Transactional
    public void acceptFollowRequest(Long requestId, String username) {
        FollowRequest request = followRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Follow request not found with ID: " + requestId));

        if (!request.getTarget().getUsername().equals(username)) {
            throw new SecurityException("You are not authorized to accept this request.");
        }

        User requester = request.getRequester();
        User target = request.getTarget();

        requester.follow(target);
        userRepository.save(requester);

        followRequestRepository.delete(request);
        notificationService.notifyFollowAccepted(requester, target);
    }

    // Reject an incoming follow request
    @Transactional
    public void rejectFollowRequest(Long requestId, String username) {
        FollowRequest request = followRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Follow request not found with ID: " + requestId));

        if (!request.getTarget().getUsername().equals(username)) {
            throw new SecurityException("You are not authorized to reject this request.");
        }

        followRequestRepository.delete(request);
    }

    // Upload and update user avatar with a custom image file
    @Transactional
    public UserProfileResponse updateAvatarFile(String username, org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file to upload.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (user.isBanned()) {
            throw new SecurityException("Banned accounts cannot update profile picture.");
        }

        // Store new image file (validates MIME format with Apache Tika and saves to /uploads/uuid.ext)
        String newAvatarUrl = fileStorageService.storeFile(file);

        // Delete old custom upload if it was not a default preset
        String oldAvatar = user.getAvatarUrl();
        if (oldAvatar != null && oldAvatar.startsWith("/uploads/") && !oldAvatar.startsWith("/uploads/avatars/")) {
            fileStorageService.deleteFile(oldAvatar);
        }

        user.setAvatarUrl(newAvatarUrl);
        userRepository.save(user);

        return getUserProfile(username, username);
    }

    // Select a preset brutalist avatar from the gallery
    @Transactional
    public UserProfileResponse updateAvatarPreset(String username, String presetUrl) {
        if (presetUrl == null || presetUrl.isBlank() || !avatarService.isValidPreset(presetUrl)) {
            throw new IllegalArgumentException("Invalid preset avatar selection.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (user.isBanned()) {
            throw new SecurityException("Banned accounts cannot update profile picture.");
        }

        // Delete old custom upload if user was using a custom uploaded image
        String oldAvatar = user.getAvatarUrl();
        if (oldAvatar != null && oldAvatar.startsWith("/uploads/") && !oldAvatar.startsWith("/uploads/avatars/")) {
            fileStorageService.deleteFile(oldAvatar);
        }

        user.setAvatarUrl(presetUrl.trim());
        userRepository.save(user);

        return getUserProfile(username, username);
    }
}
