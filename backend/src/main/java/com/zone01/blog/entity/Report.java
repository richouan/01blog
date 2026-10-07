package com.zone01.blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Objects;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The student who submitted the moderation report
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    // Specifies whether the report flags a student profile or a specific post
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private ReportTargetType targetType;

    // The student being reported (profile owner or author of reported post)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reported_user_id", nullable = false)
    private User reportedUser;

    // If targetType is POST, reference the specific post (nullable if reporting profile)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_post_id")
    private Post reportedPost;

    // Mandatory textual explanation from the reporter
    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Default constructor required by JPA
    public Report() {
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    // Convenience constructor for reporting a user profile
    public Report(User reporter, User reportedUser, String reason) {
        this.reporter = reporter;
        this.targetType = ReportTargetType.USER;
        this.reportedUser = reportedUser;
        this.reportedPost = null;
        this.reason = reason;
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    // Convenience constructor for reporting a specific post
    public Report(User reporter, User reportedUser, Post reportedPost, String reason) {
        this.reporter = reporter;
        this.targetType = ReportTargetType.POST;
        this.reportedUser = reportedUser;
        this.reportedPost = reportedPost;
        this.reason = reason;
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public ReportTargetType getTargetType() {
        return targetType;
    }

    public void setTargetType(ReportTargetType targetType) {
        this.targetType = targetType;
    }

    public User getReportedUser() {
        return reportedUser;
    }

    public void setReportedUser(User reportedUser) {
        this.reportedUser = reportedUser;
    }

    public Post getReportedPost() {
        return reportedPost;
    }

    public void setReportedPost(Post reportedPost) {
        this.reportedPost = reportedPost;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Report report = (Report) o;
        return Objects.equals(id, report.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
