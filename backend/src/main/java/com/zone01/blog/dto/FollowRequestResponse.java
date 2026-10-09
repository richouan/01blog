package com.zone01.blog.dto;

import com.zone01.blog.entity.FollowRequest;
import java.time.LocalDateTime;

// Client DTO representing an incoming follow request for private accounts
public class FollowRequestResponse {

    private Long id;
    private Long requesterId;
    private String requesterUsername;
    private String requesterAvatarUrl;
    private LocalDateTime createdAt;

    public FollowRequestResponse() {
    }

    public FollowRequestResponse(Long id, Long requesterId, String requesterUsername, String requesterAvatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.requesterId = requesterId;
        this.requesterUsername = requesterUsername;
        this.requesterAvatarUrl = requesterAvatarUrl;
        this.createdAt = createdAt;
    }

    public static FollowRequestResponse fromEntity(FollowRequest entity) {
        String avatar = entity.getRequester().getAvatarUrl();
        if (avatar == null || avatar.isBlank()) {
            avatar = "/uploads/avatars/brutalist-" + (Math.abs(entity.getRequester().getUsername().hashCode() % 10) + 1) + ".svg";
        }
        return new FollowRequestResponse(
                entity.getId(),
                entity.getRequester().getId(),
                entity.getRequester().getUsername(),
                avatar,
                entity.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequesterUsername() {
        return requesterUsername;
    }

    public void setRequesterUsername(String requesterUsername) {
        this.requesterUsername = requesterUsername;
    }

    public String getRequesterAvatarUrl() {
        return requesterAvatarUrl;
    }

    public void setRequesterAvatarUrl(String requesterAvatarUrl) {
        this.requesterAvatarUrl = requesterAvatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
