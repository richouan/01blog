package com.zone01.blog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.zone01.blog.entity.Notification;
import java.time.LocalDateTime;

// DTO representing a notification sent to the frontend
public class NotificationResponse {

    private Long id;
    private String type;
    private String message;
    private String actorUsername;
    private String actorAvatarUrl;
    private Long referenceId;

    @JsonProperty("isRead")
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    public NotificationResponse(Long id, String type, String message, String actorUsername, String actorAvatarUrl,
                                Long referenceId, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.message = message;
        this.actorUsername = actorUsername;
        this.actorAvatarUrl = actorAvatarUrl;
        this.referenceId = referenceId;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // Factory method converting JPA entity into a safe client DTO
    public static NotificationResponse fromEntity(Notification entity) {
        String actorAvatar = (entity.getActor() != null) ? entity.getActor().getAvatarUrl() : null;
        if (actorAvatar == null || actorAvatar.isBlank()) {
            if (entity.getActor() != null) {
                int idx = (Math.abs(entity.getActor().getUsername().hashCode()) % 10) + 1;
                actorAvatar = "/uploads/avatars/brutalist-" + idx + ".svg";
            }
        }
        return new NotificationResponse(
                entity.getId(),
                entity.getType().name(),
                entity.getMessage(),
                entity.getActor() != null ? entity.getActor().getUsername() : null,
                actorAvatar,
                entity.getReferenceId(),
                entity.isRead(),
                entity.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getActorUsername() {
        return actorUsername;
    }

    public void setActorUsername(String actorUsername) {
        this.actorUsername = actorUsername;
    }

    public String getActorAvatarUrl() {
        return actorAvatarUrl;
    }

    public void setActorAvatarUrl(String actorAvatarUrl) {
        this.actorAvatarUrl = actorAvatarUrl;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    @JsonProperty("isRead")
    public boolean isRead() {
        return isRead;
    }

    @JsonProperty("isRead")
    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
