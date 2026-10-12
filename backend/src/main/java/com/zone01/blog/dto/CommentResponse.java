package com.zone01.blog.dto;

import com.zone01.blog.entity.Comment;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private Long postId;
    private Long authorId;
    private String authorUsername;
    private String authorAvatarUrl;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponse() {
    }

    public CommentResponse(Long id, Long postId, Long authorId, String authorUsername, String authorAvatarUrl, String content, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.postId = postId;
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.authorAvatarUrl = authorAvatarUrl;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Factory method to convert JPA entity to API response DTO
    public static CommentResponse fromEntity(Comment comment) {
        if (comment == null) {
            return null;
        }
        String avatar = (comment.getAuthor() != null) ? comment.getAuthor().getAvatarUrl() : null;
        if (avatar == null || avatar.isBlank()) {
            if (comment.getAuthor() != null) {
                int idx = (Math.abs(comment.getAuthor().getUsername().hashCode()) % 10) + 1;
                avatar = "/uploads/avatars/brutalist-" + idx + ".svg";
            }
        }
        return new CommentResponse(
                comment.getId(),
                comment.getPost() != null ? comment.getPost().getId() : null,
                comment.getAuthor() != null ? comment.getAuthor().getId() : null,
                comment.getAuthor() != null ? comment.getAuthor().getUsername() : null,
                avatar,
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
