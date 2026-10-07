package com.zone01.blog.controller;

import com.zone01.blog.dto.LikeResponse;
import com.zone01.blog.dto.PostResponse;
import com.zone01.blog.service.LikeService;
import com.zone01.blog.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final LikeService likeService;

    public PostController(PostService postService, LikeService likeService) {
        this.postService = postService;
        this.likeService = likeService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam(name = "title", required = true) String title,
            @RequestParam(name = "textContent", required = false) String textContent,
            @RequestParam(name = "file", required = false) MultipartFile file,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to create a post."));
        }

        try {
            String authorUsername = authentication.getName();
            PostResponse createdPost = postService.createPost(title, textContent, file, authorUsername);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating post: " + e.getMessage()));
        }
    }

    // Get all global public posts (latest first)
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(Authentication authentication) {
        String currentUsername = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        return ResponseEntity.ok(postService.getAllPosts(currentUsername));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserPosts(@PathVariable("username") @NonNull String username, Authentication authentication) {
        try {
            String currentUsername = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
            return ResponseEntity.ok(postService.getUserPosts(username, currentUsername));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to view your feed."));
        }

        try {
            return ResponseEntity.ok(postService.getFeedPosts(authentication.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Toggle like/unlike on a post
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable("id") @NonNull Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to like a post."));
        }

        try {
            LikeResponse response = likeService.toggleLike(id, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error toggling like: " + e.getMessage()));
        }
    }

    // Query like status and total like count for a post
    @GetMapping("/{id}/like")
    public ResponseEntity<?> getLikeStatus(@PathVariable("id") @NonNull Long id, Authentication authentication) {
        try {
            String username = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
            LikeResponse response = likeService.getLikeStatus(id, username);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching like status: " + e.getMessage()));
        }
    }

    // Update existing post (author or admin)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
            @PathVariable("id") @NonNull Long id,
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "textContent", required = false) String textContent,
            @RequestParam(name = "file", required = false) MultipartFile file,
            @RequestParam(name = "removeMedia", required = false, defaultValue = "false") boolean removeMedia,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to edit a post."));
        }

        try {
            PostResponse updated = postService.updatePost(id, title, textContent, file, removeMedia, authentication.getName());
            return ResponseEntity.ok(updated);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating post: " + e.getMessage()));
        }
    }

    // Delete post (author or admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable("id") @NonNull Long id,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to delete a post."));
        }

        try {
            postService.deletePost(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully", "id", id));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting post: " + e.getMessage()));
        }
    }
}
