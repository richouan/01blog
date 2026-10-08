package com.zone01.blog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.zone01.blog.entity.UserRole;
import java.time.LocalDateTime;

public class UserProfileResponse {

    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;
    private int followersCount;
    private int followingCount;

    @JsonProperty("isFollowing")
    private boolean isFollowing;

    @JsonProperty("privateProfile")
    private boolean privateProfile;

    @JsonProperty("hasPendingRequest")
    private boolean hasPendingRequest;

    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String username, String email, UserRole role, 
                              LocalDateTime createdAt, int followersCount, int followingCount, 
                              boolean isFollowing, boolean privateProfile) {
        this(id, username, email, role, createdAt, followersCount, followingCount, isFollowing, privateProfile, false);
    }

    public UserProfileResponse(Long id, String username, String email, UserRole role, 
                              LocalDateTime createdAt, int followersCount, int followingCount, 
                              boolean isFollowing, boolean privateProfile, boolean hasPendingRequest) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.isFollowing = isFollowing;
        this.privateProfile = privateProfile;
        this.hasPendingRequest = hasPendingRequest;
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

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }

    public boolean isPrivateProfile() {
        return privateProfile;
    }

    public void setPrivateProfile(boolean privateProfile) {
        this.privateProfile = privateProfile;
    }

    public boolean isHasPendingRequest() {
        return hasPendingRequest;
    }

    public void setHasPendingRequest(boolean hasPendingRequest) {
        this.hasPendingRequest = hasPendingRequest;
    }
}

