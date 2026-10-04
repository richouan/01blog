package com.zone01.blog.controller;

import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// REST controller for user profiles and user-related endpoints
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Returns profile of currently authenticated user using JWT context
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        UserProfileResponse profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    // Returns profile of any user by username (for the user block/profile page)
    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String username) {
        UserProfileResponse profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }
}
