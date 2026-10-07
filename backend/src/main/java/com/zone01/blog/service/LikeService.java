package com.zone01.blog.service;

import com.zone01.blog.dto.LikeResponse;
import com.zone01.blog.entity.Like;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
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

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        boolean isLiked;
        if (existingLike.isPresent()) {
            Like toDelete = Objects.requireNonNull(existingLike.get());
            likeRepository.delete(toDelete);
            isLiked = false;
        } else {
            Like newLike = new Like(user, post);
            likeRepository.save(newLike);
            isLiked = true;
        }

        long count = likeRepository.countByPost(post);
        return new LikeResponse(postId, isLiked, count);
    }

    // Get current like status and total like count for a post
    @Transactional(readOnly = true)
    public LikeResponse getLikeStatus(@NonNull Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        boolean isLiked = false;
        if (username != null && !username.isBlank()) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                isLiked = likeRepository.existsByUserAndPost(user, post);
            }
        }

        long count = likeRepository.countByPost(post);
        return new LikeResponse(postId, isLiked, count);
    }
}
