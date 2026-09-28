package com.zone01.blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// @Entity marks this class as a database table managed by Hibernate
@Entity
// @Table specifies the name of the table in PostgreSQL ("users" instead of "user" to avoid SQL reserved keyword)
@Table(name = "users")
public class User {

    // Primary key with auto-increment (1, 2, 3...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique username, cannot be null
    @Column(nullable = false, unique = true)
    private String username;

    // Unique email, cannot be null
    @Column(nullable = false, unique = true)
    private String email;

    // Hashed password (never store plain text passwords!)
    @Column(nullable = false)
    private String password;

    // Timestamp when the user registered
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Default constructor is required by JPA/Hibernate
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    // Convenience constructor to easily create a new user
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
    }

    // --- Standard Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
