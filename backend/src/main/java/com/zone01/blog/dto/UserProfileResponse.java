package com.zone01.blog.dto;

import com.zone01.blog.entity.UserRole;
import java.time.LocalDateTime;

// DTO representing user profile data returned to frontend
public class UserProfileResponse {

    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;

    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String username, String email, UserRole role, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
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

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
