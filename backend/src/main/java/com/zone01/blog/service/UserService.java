package com.zone01.blog.service;

import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.UserRepository;
import org.springframework.stereotype.Service;

// Service handling user profile and account operations
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Fetches the public profile data of a user by username
    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
