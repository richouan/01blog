package com.zone01.blog.service;

import com.zone01.blog.dto.ReportRequest;
import com.zone01.blog.dto.ReportResponse;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.Report;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.PostRepository;
import com.zone01.blog.repository.ReportRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, PostRepository postRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    // Submit a moderation report for a student profile or post
    @Transactional
    public ReportResponse submitReport(String reporterUsername, ReportRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Report payload cannot be empty.");
        }

        String reason = (request.getReason() != null) ? request.getReason().trim() : null;
        if (reason == null || reason.isEmpty()) {
            throw new IllegalArgumentException("Report reason is required.");
        }
        if (reason.length() > 1000) {
            throw new IllegalArgumentException("Report reason must not exceed 1000 characters.");
        }

        User reporter = userRepository.findByUsername(reporterUsername)
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found: " + reporterUsername));

        if (reporter.isBanned()) {
            throw new SecurityException("Banned accounts cannot submit reports.");
        }

        String targetTypeStr = (request.getTargetType() != null) ? request.getTargetType().trim().toUpperCase() : "USER";
        Report report;

        if ("POST".equals(targetTypeStr)) {
            if (request.getTargetPostId() == null) {
                throw new IllegalArgumentException("Target post ID is required when reporting a post.");
            }
            Post reportedPost = postRepository.findById(request.getTargetPostId())
                    .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + request.getTargetPostId()));

            User reportedUser = reportedPost.getAuthor();
            if (reporter.getId().equals(reportedUser.getId())) {
                throw new IllegalArgumentException("You cannot report your own post.");
            }

            report = new Report(reporter, reportedUser, reportedPost, reason);
        } else {
            // Reporting a user profile
            if (request.getTargetUserId() == null) {
                throw new IllegalArgumentException("Target user ID is required when reporting a profile.");
            }
            User reportedUser = userRepository.findById(request.getTargetUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + request.getTargetUserId()));

            if (reporter.getId().equals(reportedUser.getId())) {
                throw new IllegalArgumentException("You cannot report your own profile.");
            }

            report = new Report(reporter, reportedUser, reason);
        }

        Report saved = reportRepository.save(report);
        return ReportResponse.fromEntity(saved);
    }

    // Fetch all reports (visible only to administrators)
    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ReportResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Dismiss or resolve an individual report
    @Transactional
    public void dismissReport(@NonNull Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new IllegalArgumentException("Report not found with ID: " + reportId);
        }
        reportRepository.deleteById(reportId);
    }
}
