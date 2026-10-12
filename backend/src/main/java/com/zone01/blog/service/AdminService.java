package com.zone01.blog.service;

import com.zone01.blog.dto.AdminStatsResponse;
import com.zone01.blog.dto.AdminUserResponse;
import com.zone01.blog.dto.PostResponse;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.*;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final FileStorageService fileStorageService;
    private final PostService postService;

    public AdminService(UserRepository userRepository, PostRepository postRepository,
                        ReportRepository reportRepository, LikeRepository likeRepository,
                        CommentRepository commentRepository, NotificationRepository notificationRepository,
                        FileStorageService fileStorageService, PostService postService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.reportRepository = reportRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.notificationRepository = notificationRepository;
        this.fileStorageService = fileStorageService;
        this.postService = postService;
    }

    // Platform metrics overview for admin dashboard header
    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long totalReports = reportRepository.count();
        long bannedUsers = userRepository.countByBannedTrue();
        return new AdminStatsResponse(totalUsers, totalPosts, totalReports, bannedUsers);
    }

    // List all registered students with their post counts
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> AdminUserResponse.fromEntity(user, postRepository.countByAuthor(user)))
                .collect(Collectors.toList());
    }

    // Toggle ban status on a user account
    @Transactional
    public AdminUserResponse toggleBanUser(@NonNull Long userId, String requestingAdminUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (user.getUsername().equalsIgnoreCase(requestingAdminUsername)) {
            throw new IllegalArgumentException("Administrators cannot ban their own account.");
        }

        user.setBanned(!user.isBanned());
        User saved = userRepository.save(user);
        return AdminUserResponse.fromEntity(saved, postRepository.countByAuthor(saved));
    }

    // Delete a user account and clean up all dependent relations
    @Transactional
    public void deleteUser(@NonNull Long userId, String requestingAdminUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (user.getUsername().equalsIgnoreCase(requestingAdminUsername)) {
            throw new IllegalArgumentException("Administrators cannot delete their own account.");
        }

        // 1. Delete moderation reports involving this user
        reportRepository.deleteAllByReportedUser(user);
        reportRepository.deleteAllByReporter(user);

        // 3. Delete notifications sent to or triggered by this user
        notificationRepository.deleteAllByRecipient(user);
        notificationRepository.deleteAllByActor(user);

        // 3. Delete likes and comments authored by this user
        likeRepository.deleteAllByUser(user);
        commentRepository.deleteAllByAuthor(user);

        // 4. Delete posts authored by this user (including media files)
        List<Post> userPosts = postRepository.findByAuthorOrderByCreatedAtDesc(user);
        for (Post p : userPosts) {
            likeRepository.deleteAllByPostId(p.getId());
            commentRepository.deleteAllByPostId(p.getId());
            reportRepository.deleteAllByReportedPost(p);
            fileStorageService.deleteFile(p.getMediaUrl());
            postRepository.delete(p);
        }

        // 5. Clean up social subscription graphs
        for (User follower : user.getFollowers()) {
            follower.getFollowing().remove(user);
            userRepository.save(follower);
        }
        for (User target : user.getFollowing()) {
            target.getFollowers().remove(user);
            userRepository.save(target);
        }
        user.getFollowers().clear();
        user.getFollowing().clear();
        userRepository.save(user);

        // 6. Delete user entity
        userRepository.delete(user);
    }

    // List all posts across the platform for the admin moderation table
    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(p -> {
                    long likes = likeRepository.countByPost(p);
                    long comments = commentRepository.countByPost(p);
                    return PostResponse.fromEntity(p, likes, false, comments);
                })
                .collect(Collectors.toList());
    }

    // Soft moderation: toggle post visibility on the stream
    @Transactional
    public PostResponse toggleHidePost(@NonNull Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        post.setHidden(!post.isHidden());
        Post saved = postRepository.save(post);
        long likes = likeRepository.countByPost(saved);
        long comments = commentRepository.countByPost(saved);
        return PostResponse.fromEntity(saved, likes, false, comments);
    }

    // Delete post permanently
    @Transactional
    public void deletePost(@NonNull Long postId, String requestingAdminUsername) {
        postService.deletePost(postId, requestingAdminUsername);
    }
}
