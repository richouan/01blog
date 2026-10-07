package com.zone01.blog.repository;

import com.zone01.blog.entity.Comment;
import com.zone01.blog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(@NonNull Post post);
    List<Comment> findByPostIdOrderByCreatedAtAsc(@NonNull Long postId);
    long countByPost(@NonNull Post post);
    long countByPostId(@NonNull Long postId);
    void deleteAllByPostId(@NonNull Long postId);
}
