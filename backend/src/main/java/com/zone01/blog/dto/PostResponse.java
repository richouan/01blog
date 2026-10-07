package com.zone01.blog.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.zone01.blog.entity.Post;
import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private String title;
    private String textContent;
    private String mediaUrl;
    private Long authorId;
    private String authorUsername;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime updatedAt;

    private long likesCount;
    private boolean liked;

    public PostResponse() {}

    public PostResponse(Long id, String title, String textContent, String mediaUrl, Long authorId, 
                        String authorUsername, LocalDateTime createdAt, LocalDateTime updatedAt,
                        long likesCount, boolean liked) {
        this.id = id;
        this.title = title;
        this.textContent = textContent;
        this.mediaUrl = mediaUrl;
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.likesCount = likesCount;
        this.liked = liked;
    }

    // Static helpers to map Post entity directly to PostResponse DTO
    public static PostResponse fromEntity(Post post, long likesCount, boolean liked) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getTextContent(),
                post.getMediaUrl(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                likesCount,
                liked
        );
    }

    public static PostResponse fromEntity(Post post, long likesCount) {
        return fromEntity(post, likesCount, false);
    }

    public static PostResponse fromEntity(Post post) {
        return fromEntity(post, 0L, false);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTextContent() {
        return textContent;
    }

    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
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

    public long getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }
}
