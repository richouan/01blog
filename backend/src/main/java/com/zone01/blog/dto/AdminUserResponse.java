package com.zone01.blog.dto;

import com.zone01.blog.entity.User;
import java.time.LocalDateTime;

// DTO representing user details in the admin moderation dashboard
public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean banned;
    private long postsCount;
    private LocalDateTime createdAt;

    public AdminUserResponse() {
    }

    public AdminUserResponse(Long id, String username, String email, String role,
                             boolean banned, long postsCount, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.banned = banned;
        this.postsCount = postsCount;
        this.createdAt = createdAt;
    }

    public static AdminUserResponse fromEntity(User user, long postsCount) {
        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.isBanned(),
                postsCount,
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isBanned() {
        return banned;
    }

    public void setBanned(boolean banned) {
        this.banned = banned;
    }

    public long getPostsCount() {
        return postsCount;
    }

    public void setPostsCount(long postsCount) {
        this.postsCount = postsCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
