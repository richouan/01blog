package com.zone01.blog.dto;

// DTO for submitting a moderation report
public class ReportRequest {

    private String targetType; // "USER" or "POST"
    private Long targetUserId;
    private Long targetPostId;
    private String reason;

    public ReportRequest() {
    }

    public ReportRequest(String targetType, Long targetUserId, Long targetPostId, String reason) {
        this.targetType = targetType;
        this.targetUserId = targetUserId;
        this.targetPostId = targetPostId;
        this.reason = reason;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public Long getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Long targetUserId) {
        this.targetUserId = targetUserId;
    }

    public Long getTargetPostId() {
        return targetPostId;
    }

    public void setTargetPostId(Long targetPostId) {
        this.targetPostId = targetPostId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
