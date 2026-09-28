package com.zone01.blog.repository;

import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their username (used during Login)
    Optional<User> findByUsername(String username);

    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Check if a username is already taken (used during Registration)
    boolean existsByUsername(String username);

    // Check if an email is already taken (used during Registration)
    boolean existsByEmail(String email);
}
