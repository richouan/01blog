package com.zone01.blog.controller;

import com.zone01.blog.dto.UserProfileResponse;
import com.zone01.blog.service.AvatarService;
import com.zone01.blog.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AvatarService avatarService;

    public UserController(UserService userService, AvatarService avatarService) {
        this.userService = userService;
        this.avatarService = avatarService;
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

    // Get list of all available default brutalist avatars for student selection
    @GetMapping("/avatars/presets")
    public ResponseEntity<List<String>> getPresetAvatars() {
        return ResponseEntity.ok(avatarService.getPresetAvatarUrls());
    }

    // Upload custom profile picture file
    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }

        try {
            UserProfileResponse updated = userService.updateAvatarFile(authentication.getName(), file);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating avatar: " + e.getMessage()));
        }
    }

    // Choose a preset brutalist avatar from the gallery
    @PutMapping("/me/avatar/preset")
    public ResponseEntity<?> updateAvatarPreset(
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }

        try {
            String presetUrl = (body != null) ? body.get("avatarUrl") : null;
            UserProfileResponse updated = userService.updateAvatarPreset(authentication.getName(), presetUrl);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating preset avatar: " + e.getMessage()));
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

    @GetMapping("/requests/pending")
    public ResponseEntity<?> getPendingRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }
        return ResponseEntity.ok(userService.getPendingRequests(authentication.getName()));
    }

    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<?> acceptFollowRequest(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }
        try {
            userService.acceptFollowRequest(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Follow request accepted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{id}/reject")
    public ResponseEntity<?> rejectFollowRequest(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated"));
        }
        try {
            userService.rejectFollowRequest(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Follow request rejected"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
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
            Map<String, Object> result = userService.subscribe(authentication.getName(), username);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
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
            return ResponseEntity.ok(Map.of("message", "Unsubscribed from @" + username, "following", false, "requested", false));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

