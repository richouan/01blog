package com.zone01.blog.service;

import com.zone01.blog.dto.LikeResponse;
import com.zone01.blog.entity.Like;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import com.zone01.blog.entity.UserRole;
import com.zone01.blog.repository.LikeRepository;
import com.zone01.blog.repository.PostRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // Toggle like state: like if not yet liked, unlike if already liked
    @Transactional
    public LikeResponse toggleLike(@NonNull Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (user.isBanned()) {
            throw new SecurityException("Banned accounts cannot like posts.");
        }

        User author = post.getAuthor();

        // Guard against liking hidden posts
        if (post.isHidden()) {
            boolean isAuthor = author.getId().equals(user.getId());
            boolean isAdmin = user.getRole() == UserRole.ROLE_ADMIN;
            if (!isAuthor && !isAdmin) {
                throw new SecurityException("Cannot like a post that has been hidden by moderators.");
            }
        }

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        boolean isLiked;
        if (existingLike.isPresent()) {
            Like toDelete = Objects.requireNonNull(existingLike.get());
            likeRepository.delete(toDelete);
            likeRepository.flush();
            isLiked = false;
        } else {
            Like newLike = new Like(user, post);
            likeRepository.saveAndFlush(newLike);
            isLiked = true;
        }

        long count = likeRepository.countByPost(post);
        return new LikeResponse(postId, isLiked, count);
    }

    // Get current like status and total like count for a post (verifying post visibility)
    @Transactional(readOnly = true)
    public LikeResponse getLikeStatus(@NonNull Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        User requestingUser = (username != null && !username.isBlank())
                ? userRepository.findByUsername(username).orElse(null)
                : null;

        // If post is hidden, non-authors/non-admins cannot inspect like count
        if (post.isHidden()) {
            boolean isAuthor = (requestingUser != null) && post.getAuthor().getId().equals(requestingUser.getId());
            boolean isAdmin = (requestingUser != null) && requestingUser.getRole() == UserRole.ROLE_ADMIN;
            if (!isAuthor && !isAdmin) {
                return new LikeResponse(postId, false, 0);
            }
        }

        boolean isLiked = false;
        if (requestingUser != null) {
            isLiked = likeRepository.existsByUserAndPost(requestingUser, post);
        }

        long count = likeRepository.countByPost(post);
        return new LikeResponse(postId, isLiked, count);
    }
}
