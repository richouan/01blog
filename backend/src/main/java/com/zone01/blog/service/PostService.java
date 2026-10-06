package com.zone01.blog.service;

import com.zone01.blog.dto.PostResponse;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.PostRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public PostService(PostRepository postRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public PostResponse createPost(String textContent, MultipartFile file, String authorUsername) {
        String trimmedText = (textContent != null) ? textContent.trim() : null;
        boolean hasText = trimmedText != null && !trimmedText.isEmpty();
        boolean hasFile = file != null && !file.isEmpty();

        if (!hasText && !hasFile) {
            throw new IllegalArgumentException("Post must contain text content or an uploaded media file.");
        }

        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new IllegalArgumentException("Author not found: " + authorUsername));

        String mediaUrl = fileStorageService.storeFile(file);

        Post post = new Post(hasText ? trimmedText : null, mediaUrl, author);
        Post savedPost = postRepository.save(post);

        return PostResponse.fromEntity(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(PostResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getUserPosts(String username) {
        return postRepository.findByAuthorUsernameOrderByCreatedAtDesc(username).stream()
                .map(PostResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getFeedPosts(String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));

        Set<User> targetAuthors = new HashSet<>(currentUser.getFollowing());
        targetAuthors.add(currentUser);

        return postRepository.findByAuthorInOrderByCreatedAtDesc(targetAuthors).stream()
                .map(PostResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
