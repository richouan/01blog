package com.zone01.blog.controller;

import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }

        try {
            String username = authentication.getName();
            UserProfileResponse profile = userService.getUserProfile(username, username);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/me/privacy")
    public ResponseEntity<?> updatePrivacy(
            @RequestBody(required = false) Map<String, Boolean> body,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }

        try {
            Boolean explicitPrivacy = (body != null && body.containsKey("privateProfile")) 
                    ? body.get("privateProfile") 
                    : null;
            UserProfileResponse updated = userService.updateProfilePrivacy(authentication.getName(), explicitPrivacy);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<java.util.List<UserProfileResponse>> searchUsers(
            @RequestParam(name = "q", defaultValue = "") String query,
            Authentication authentication
    ) {
        String currentViewer = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : null;
        java.util.List<UserProfileResponse> results = userService.searchUsers(query, currentViewer);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username, Authentication authentication) {
        try {
            String currentViewer = (authentication != null && authentication.isAuthenticated()) 
                    ? authentication.getName() 
                    : null;
            UserProfileResponse profile = userService.getUserProfile(username, currentViewer);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping({"/{username}/follow", "/{username}/subscribe"})
    public ResponseEntity<?> followUser(@PathVariable String username, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }

        try {
            userService.subscribe(authentication.getName(), username);
            return ResponseEntity.ok(Map.of("message", "Subscribed to @" + username, "following", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping({"/{username}/unfollow", "/{username}/unsubscribe"})
    public ResponseEntity<?> unfollowUser(@PathVariable String username, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }

        try {
            userService.unsubscribe(authentication.getName(), username);
            return ResponseEntity.ok(Map.of("message", "Unsubscribed from @" + username, "following", false));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

