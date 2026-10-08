package com.zone01.blog.controller;

import com.zone01.blog.dto.AdminStatsResponse;
import com.zone01.blog.dto.AdminUserResponse;
import com.zone01.blog.dto.PostResponse;
import com.zone01.blog.dto.ReportResponse;
import com.zone01.blog.service.AdminService;
import com.zone01.blog.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    public AdminController(AdminService adminService, ReportService reportService) {
        this.adminService = adminService;
        this.reportService = reportService;
    }

    // Platform statistics for admin dashboard metrics cards
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // List all submitted moderation reports
    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Dismiss or resolve a report
    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> dismissReport(@PathVariable @NonNull Long id) {
        reportService.dismissReport(id);
        return ResponseEntity.noContent().build();
    }

    // List all registered students
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Toggle ban on a user account
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<AdminUserResponse> toggleBanUser(@PathVariable @NonNull Long id, Authentication authentication) {
        String adminUsername = (authentication != null) ? authentication.getName() : "admin";
        AdminUserResponse response = adminService.toggleBanUser(id, adminUsername);
        return ResponseEntity.ok(response);
    }

    // Delete a user account and clean up dependencies
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @NonNull Long id, Authentication authentication) {
        String adminUsername = (authentication != null) ? authentication.getName() : "admin";
        adminService.deleteUser(id, adminUsername);
        return ResponseEntity.noContent().build();
    }

    // List all posts on the platform
    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(adminService.getAllPosts());
    }

    // Soft-moderation: hide/unhide post from public feeds
    @PutMapping("/posts/{id}/hide")
    public ResponseEntity<PostResponse> toggleHidePost(@PathVariable @NonNull Long id) {
        PostResponse response = adminService.toggleHidePost(id);
        return ResponseEntity.ok(response);
    }

    // Permanently delete a post
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable @NonNull Long id, Authentication authentication) {
        String adminUsername = (authentication != null) ? authentication.getName() : "admin";
        adminService.deletePost(id, adminUsername);
        return ResponseEntity.noContent().build();
    }
}
