package com.zone01.blog.service;

import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // readOnly keeps session open for lazy-loaded collections (followers/following)
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String targetUsername, String currentViewerUsername) {
        User user = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUsername));

        int followersCount = user.getFollowers().size();
        int followingCount = user.getFollowing().size();

        boolean isFollowing = false;
        if (currentViewerUsername != null && !currentViewerUsername.equals(targetUsername)) {
            User currentViewer = userRepository.findByUsername(currentViewerUsername).orElse(null);
            if (currentViewer != null) {
                isFollowing = currentViewer.getFollowing().stream()
                        .anyMatch(u -> java.util.Objects.equals(u.getId(), user.getId()));
            }
        }

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                followersCount,
                followingCount,
                isFollowing
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

        return users.stream().map(user -> {
            boolean isFollowing = false;
            if (currentViewer != null && !currentViewer.getId().equals(user.getId())) {
                isFollowing = currentViewer.getFollowing().stream()
                        .anyMatch(u -> java.util.Objects.equals(u.getId(), user.getId()));
            }
            return new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCreatedAt(),
                    user.getFollowers().size(),
                    user.getFollowing().size(),
                    isFollowing
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void subscribe(String currentUsername, String targetUsername) {
        if (currentUsername.equals(targetUsername)) {
            throw new IllegalArgumentException("You cannot subscribe to yourself");
        }

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUsername));

        currentUser.follow(targetUser);
        userRepository.save(currentUser);

        // Notify the followed student that they have a new follower
        notificationService.notifyNewFollower(targetUser, currentUser);
    }

    @Transactional
    public void unsubscribe(String currentUsername, String targetUsername) {
        if (currentUsername.equals(targetUsername)) {
            throw new IllegalArgumentException("You cannot unsubscribe from yourself");
        }

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUsername));

        currentUser.unfollow(targetUser);
        userRepository.save(currentUser);
    }
}

