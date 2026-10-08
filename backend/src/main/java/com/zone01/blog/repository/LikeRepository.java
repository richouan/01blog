package com.zone01.blog.repository;

import com.zone01.blog.entity.Like;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    boolean existsByUserAndPost(User user, Post post);
    long countByPost(Post post);
    long countByPostId(Long postId);
    void deleteByUserAndPost(User user, Post post);
    void deleteAllByPostId(Long postId);
    void deleteAllByUser(User user);
}
