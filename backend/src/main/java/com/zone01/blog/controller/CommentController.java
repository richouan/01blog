package com.zone01.blog.controller;

import com.zone01.blog.dto.CommentRequest;
import com.zone01.blog.dto.CommentResponse;
import com.zone01.blog.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Fetch all comments for a post (enforces post visibility rules)
    @GetMapping
    public ResponseEntity<?> getComments(
            @PathVariable("postId") @NonNull Long postId,
            Authentication authentication
    ) {
        try {
            String currentUsername = (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName()))
                    ? authentication.getName()
                    : null;
            List<CommentResponse> comments = commentService.getCommentsByPost(postId, currentUsername);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching comments: " + e.getMessage()));
        }
    }

    // Add a new comment to a post
    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable("postId") @NonNull Long postId,
            @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to comment."));
        }

        if (request == null || request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Comment content cannot be empty."));
        }

        try {
            CommentResponse response = commentService.addComment(postId, request.getContent(), authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            HttpStatus status = (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found"))
                    ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error adding comment: " + e.getMessage()));
        }
    }

    // Delete a specific comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable("postId") @NonNull Long postId,
            @PathVariable("commentId") @NonNull Long commentId,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to delete a comment."));
        }

        try {
            commentService.deleteComment(commentId, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting comment: " + e.getMessage()));
        }
    }
}
