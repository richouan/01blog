package com.zone01.blog.service;

import com.zone01.blog.dto.PostResponse;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import com.zone01.blog.entity.UserRole;
import com.zone01.blog.repository.CommentRepository;
import com.zone01.blog.repository.LikeRepository;
import com.zone01.blog.repository.PostRepository;
import com.zone01.blog.repository.ReportRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public PostService(PostRepository postRepository, UserRepository userRepository, 
                       LikeRepository likeRepository, CommentRepository commentRepository,
                       ReportRepository reportRepository,
                       FileStorageService fileStorageService,
                       NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.reportRepository = reportRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PostResponse createPost(String title, String textContent, MultipartFile file, String authorUsername) {
        String trimmedTitle = (title != null) ? title.trim() : null;
        if (trimmedTitle == null || trimmedTitle.isEmpty()) {
            throw new IllegalArgumentException("Post title is required.");
        }

        String trimmedText = (textContent != null) ? textContent.trim() : null;
        boolean hasText = trimmedText != null && !trimmedText.isEmpty();
        boolean hasFile = file != null && !file.isEmpty();

        if (!hasText && !hasFile) {
            throw new IllegalArgumentException("Post must contain text content or an uploaded media file.");
        }

        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new IllegalArgumentException("Author not found: " + authorUsername));

        if (author.isBanned()) {
            throw new SecurityException("Banned accounts cannot create posts.");
        }

        String mediaUrl = fileStorageService.storeFile(file);

        Post post = new Post(trimmedTitle, hasText ? trimmedText : null, mediaUrl, author);
        Post savedPost = postRepository.save(post);

        // Notify all subscribers/followers that a new post was published
        notificationService.notifyNewPost(savedPost);

        return PostResponse.fromEntity(savedPost, 0L, false, 0L);
    }

    // Update post with author/admin access control and media management
    @Transactional
    public PostResponse updatePost(@NonNull Long postId, String title, String textContent, MultipartFile file, boolean removeMedia, String requestingUsername) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        User requestingUser = userRepository.findByUsername(requestingUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + requestingUsername));

        if (requestingUser.isBanned()) {
            throw new SecurityException("Banned accounts cannot edit posts.");
        }

        boolean isAuthor = post.getAuthor().getUsername().equals(requestingUsername);
        boolean isAdmin = requestingUser.getRole() == UserRole.ROLE_ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new SecurityException("You do not have permission to edit this post.");
        }

        String trimmedTitle = (title != null) ? title.trim() : null;
        if (trimmedTitle != null && !trimmedTitle.isEmpty()) {
            post.setTitle(trimmedTitle);
        }

        String trimmedText = (textContent != null) ? textContent.trim() : null;
        boolean hasText = trimmedText != null && !trimmedText.isEmpty();

        // Handle media updates
        if (file != null && !file.isEmpty()) {
            fileStorageService.deleteFile(post.getMediaUrl());
            String newMediaUrl = fileStorageService.storeFile(file);
            post.setMediaUrl(newMediaUrl);
        } else if (removeMedia) {
            fileStorageService.deleteFile(post.getMediaUrl());
            post.setMediaUrl(null);
        }

        // Validate that post is not left completely empty
        if (!hasText && (post.getMediaUrl() == null || post.getMediaUrl().isBlank())) {
            throw new IllegalArgumentException("Post cannot be completely empty.");
        }

        post.setTextContent(hasText ? trimmedText : null);
        post.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));

        Post updatedPost = postRepository.save(post);
        long likesCount = likeRepository.countByPost(updatedPost);
        boolean isLiked = likeRepository.existsByUserAndPost(requestingUser, updatedPost);
        long commentsCount = commentRepository.countByPost(updatedPost);
        return PostResponse.fromEntity(updatedPost, likesCount, isLiked, commentsCount);
    }

    // Delete post with author/admin access control, removing likes, comments, and media cleanup
    @Transactional
    public void deletePost(@NonNull Long postId, String requestingUsername) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        User requestingUser = userRepository.findByUsername(requestingUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + requestingUsername));

        if (requestingUser.isBanned()) {
            throw new SecurityException("Banned accounts cannot delete posts.");
        }

        boolean isAuthor = post.getAuthor().getUsername().equals(requestingUsername);
        boolean isAdmin = requestingUser.getRole() == UserRole.ROLE_ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new SecurityException("You do not have permission to delete this post.");
        }

        // Remove all likes, comments, and moderation reports for this post
        likeRepository.deleteAllByPostId(postId);
        commentRepository.deleteAllByPostId(postId);
        reportRepository.deleteAllByReportedPost(post);

        // Clean up uploaded media file from disk
        fileStorageService.deleteFile(post.getMediaUrl());

        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts(String currentUsername) {
        User currentUser = (currentUsername != null) ? userRepository.findByUsername(currentUsername).orElse(null) : null;
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(post -> isVisibleToUser(post, currentUser))
                .map(post -> toPostResponse(post, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId, String currentUsername) {
        User currentUser = (currentUsername != null) ? userRepository.findByUsername(currentUsername).orElse(null) : null;
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found with ID: " + postId));
        if (!isVisibleToUser(post, currentUser)) {
            throw new SecurityException("This post is hidden or unavailable.");
        }
        return toPostResponse(post, currentUser);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getUserPosts(String username, String currentUsername) {
        User currentUser = (currentUsername != null) ? userRepository.findByUsername(currentUsername).orElse(null) : null;
        return postRepository.findByAuthorUsernameOrderByCreatedAtDesc(username).stream()
                .filter(post -> isVisibleToUser(post, currentUser))
                .map(post -> toPostResponse(post, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getFeedPosts(String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));

        Set<User> targetAuthors = new HashSet<>(currentUser.getFollowing());
        targetAuthors.add(currentUser);

        return postRepository.findByAuthorInOrderByCreatedAtDesc(targetAuthors).stream()
                .filter(post -> isVisibleToUser(post, currentUser))
                .map(post -> toPostResponse(post, currentUser))
                .collect(Collectors.toList());
    }

    // Ensures hidden posts are properly filtered for admin or author
    private boolean isVisibleToUser(Post post, User currentUser) {
        if (post.isHidden()) {
            if (currentUser == null) {
                return false;
            }
            boolean isAdmin = currentUser.getRole() == UserRole.ROLE_ADMIN;
            boolean isAuthor = post.getAuthor().getId().equals(currentUser.getId());
            if (!isAdmin && !isAuthor) {
                return false;
            }
        }

        return true;
    }

    private PostResponse toPostResponse(Post post, User currentUser) {
        long likesCount = likeRepository.countByPost(post);
        boolean liked = (currentUser != null) && likeRepository.existsByUserAndPost(currentUser, post);
        long commentsCount = commentRepository.countByPost(post);
        return PostResponse.fromEntity(post, likesCount, liked, commentsCount);
    }
}
