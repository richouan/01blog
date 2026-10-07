package com.zone01.blog.dto;

import com.zone01.blog.entity.Report;
import java.time.LocalDateTime;

// DTO representing a report for admin moderation view
public class ReportResponse {

    private Long id;
    private String reporterUsername;
    private String targetType;
    private Long reportedUserId;
    private String reportedUsername;
    private Long reportedPostId;
    private String reportedPostTitle;
    private String reason;
    private LocalDateTime createdAt;

    public ReportResponse() {
    }

    public ReportResponse(Long id, String reporterUsername, String targetType,
                          Long reportedUserId, String reportedUsername,
                          Long reportedPostId, String reportedPostTitle,
                          String reason, LocalDateTime createdAt) {
        this.id = id;
        this.reporterUsername = reporterUsername;
        this.targetType = targetType;
        this.reportedUserId = reportedUserId;
        this.reportedUsername = reportedUsername;
        this.reportedPostId = reportedPostId;
        this.reportedPostTitle = reportedPostTitle;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public static ReportResponse fromEntity(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getReporter() != null ? report.getReporter().getUsername() : "anonymous",
                report.getTargetType() != null ? report.getTargetType().name() : "USER",
                report.getReportedUser() != null ? report.getReportedUser().getId() : null,
                report.getReportedUser() != null ? report.getReportedUser().getUsername() : "unknown",
                report.getReportedPost() != null ? report.getReportedPost().getId() : null,
                report.getReportedPost() != null ? report.getReportedPost().getTitle() : null,
                report.getReason(),
                report.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReporterUsername() {
        return reporterUsername;
    }

    public void setReporterUsername(String reporterUsername) {
        this.reporterUsername = reporterUsername;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public Long getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(Long reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUsername() {
        return reportedUsername;
    }

    public void setReportedUsername(String reportedUsername) {
        this.reportedUsername = reportedUsername;
    }

    public Long getReportedPostId() {
        return reportedPostId;
    }

    public void setReportedPostId(Long reportedPostId) {
        this.reportedPostId = reportedPostId;
    }

    public String getReportedPostTitle() {
        return reportedPostTitle;
    }

    public void setReportedPostTitle(String reportedPostTitle) {
        this.reportedPostTitle = reportedPostTitle;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
