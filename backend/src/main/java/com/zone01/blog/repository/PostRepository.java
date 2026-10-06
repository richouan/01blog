package com.zone01.blog.repository;

import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByAuthorOrderByCreatedAtDesc(User author);

    List<Post> findByAuthorUsernameOrderByCreatedAtDesc(String username);

    List<Post> findByAuthorInOrderByCreatedAtDesc(Collection<User> authors);
}
