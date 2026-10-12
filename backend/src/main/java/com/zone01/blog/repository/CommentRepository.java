package com.zone01.blog.repository;

import com.zone01.blog.entity.Comment;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    long countByPost(Post post);
    void deleteAllByPostId(Long postId);
    void deleteAllByAuthor(User author);
}
