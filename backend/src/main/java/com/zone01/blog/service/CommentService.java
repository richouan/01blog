package com.zone01.blog.service;

import com.zone01.blog.dto.CommentResponse;
import com.zone01.blog.entity.Comment;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import com.zone01.blog.entity.UserRole;
import com.zone01.blog.repository.CommentRepository;
import com.zone01.blog.repository.PostRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // Add a new comment to a post
    @Transactional
    public CommentResponse addComment(@NonNull Long postId, String content, String authorUsername) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty.");
        }
        String trimmed = content.trim();
        if (trimmed.length() > 1000) {
            throw new IllegalArgumentException("Comment content must not exceed 1000 characters.");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + authorUsername));

        if (author.isBanned()) {
            throw new SecurityException("Banned accounts cannot post comments.");
        }

        Comment comment = new Comment(trimmed, post, author);
        Comment saved = commentRepository.save(comment);

        return CommentResponse.fromEntity(saved);
    }

    // Fetch all comments for a post in chronological order
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPost(@NonNull Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }

        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Delete comment with author, post author, or admin permission check
    @Transactional
    public void deleteComment(@NonNull Long commentId, String requestingUsername) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        User requestingUser = userRepository.findByUsername(requestingUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + requestingUsername));

        boolean isCommentAuthor = comment.getAuthor().getUsername().equals(requestingUsername);
        boolean isPostAuthor = comment.getPost().getAuthor().getUsername().equals(requestingUsername);
        boolean isAdmin = requestingUser.getRole() == UserRole.ROLE_ADMIN;

        if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
            throw new SecurityException("You do not have permission to delete this comment.");
        }

        commentRepository.delete(comment);
    }
}
