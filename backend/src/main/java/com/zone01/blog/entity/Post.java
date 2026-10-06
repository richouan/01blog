package com.zone01.blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Objects;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "text_content", columnDefinition = "TEXT")
    private String textContent;

    @Column(name = "media_url")
    private String mediaUrl;

    // Many posts belong to one User
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor required by JPA
    public Post() {
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
        this.updatedAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    // Convenience constructor
    public Post(String textContent, String mediaUrl, User author) {
        this.title = "Untitled Post";
        this.textContent = textContent;
        this.mediaUrl = mediaUrl;
        this.author = author;
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
        this.updatedAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    public Post(String title, String textContent, String mediaUrl, User author) {
        this.title = title;
        this.textContent = textContent;
        this.mediaUrl = mediaUrl;
        this.author = author;
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
        this.updatedAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTextContent() {
        return textContent;
    }

    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Post post = (Post) o;
        return Objects.equals(id, post.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
