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
    private String authorAvatarUrl;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime updatedAt;

    private long likesCount;
    private boolean liked;
    private long commentsCount;
    private boolean hidden;

    public PostResponse() {}

    public PostResponse(Long id, String title, String textContent, String mediaUrl, Long authorId, 
                        String authorUsername, LocalDateTime createdAt, LocalDateTime updatedAt,
                        long likesCount, boolean liked, long commentsCount) {
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
        this.commentsCount = commentsCount;
    }

    public PostResponse(Long id, String title, String textContent, String mediaUrl, Long authorId, 
                        String authorUsername, LocalDateTime createdAt, LocalDateTime updatedAt,
                        long likesCount, boolean liked) {
        this(id, title, textContent, mediaUrl, authorId, authorUsername, createdAt, updatedAt, likesCount, liked, 0L);
    }

    // Static helpers to map Post entity directly to PostResponse DTO
    public static PostResponse fromEntity(Post post, long likesCount, boolean liked, long commentsCount) {
        PostResponse resp = new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getTextContent(),
                post.getMediaUrl(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                likesCount,
                liked,
                commentsCount
        );
        String authorAvatar = post.getAuthor().getAvatarUrl();
        if (authorAvatar == null || authorAvatar.isBlank()) {
            int idx = (Math.abs(post.getAuthor().getUsername().hashCode()) % 10) + 1;
            authorAvatar = "/uploads/avatars/brutalist-" + idx + ".svg";
        }
        resp.setAuthorAvatarUrl(authorAvatar);
        resp.setHidden(post.isHidden());
        return resp;
    }

    public static PostResponse fromEntity(Post post, long likesCount, boolean liked) {
        return fromEntity(post, likesCount, liked, 0L);
    }

    public static PostResponse fromEntity(Post post, long likesCount) {
        return fromEntity(post, likesCount, false, 0L);
    }

    public static PostResponse fromEntity(Post post) {
        return fromEntity(post, 0L, false, 0L);
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

    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
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

    public long getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(long commentsCount) {
        this.commentsCount = commentsCount;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }
}
