package com.zone01.blog.dto;

// DTO returned upon successful registration or login
public class AuthResponse {

    private String token;
    private String username;
    private String role;
    private String avatarUrl;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String role) {
        this(token, username, role, null);
    }

    public AuthResponse(String token, String username, String role, String avatarUrl) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
