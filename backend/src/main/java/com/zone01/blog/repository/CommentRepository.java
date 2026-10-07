package com.zone01.blog.repository;

import com.zone01.blog.entity.Comment;
import com.zone01.blog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    long countByPost(Post post);
    long countByPostId(Long postId);
    void deleteAllByPostId(Long postId);
}
