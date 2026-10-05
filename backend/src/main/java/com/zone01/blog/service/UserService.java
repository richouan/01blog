package com.zone01.blog.service;

import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                isFollowing = currentViewer.getFollowing().contains(user);
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

