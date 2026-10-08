package com.zone01.blog.repository;

import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.Report;
import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Retrieve all moderation reports ordered by newest first for the admin dashboard
    List<Report> findAllByOrderByCreatedAtDesc();

    // Clean up reports when deleting a reported post
    void deleteAllByReportedPost(Post reportedPost);

    // Clean up reports when deleting a reported user
    void deleteAllByReportedUser(User reportedUser);

    // Clean up reports filed by a deleted user
    void deleteAllByReporter(User reporter);

    // Prevent spam: Check if a user already reported a post
    boolean existsByReporterAndReportedPost(User reporter, Post reportedPost);

    // Prevent spam: Check if a user already reported a profile
    boolean existsByReporterAndReportedUserAndReportedPostIsNull(User reporter, User reportedUser);
}
