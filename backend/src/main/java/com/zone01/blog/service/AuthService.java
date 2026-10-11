package com.zone01.blog.service;

import com.zone01.blog.config.JwtUtil;
import com.zone01.blog.dto.AuthResponse;
import com.zone01.blog.dto.LoginRequest;
import com.zone01.blog.dto.RegisterRequest;
import com.zone01.blog.entity.User;
import com.zone01.blog.entity.UserRole;
import com.zone01.blog.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Handles user registration, login authentication, and JWT token issuance
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AvatarService avatarService;

    // Constructor injection for required dependencies
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AvatarService avatarService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.avatarService = avatarService;
    }

    // Registers a new user with validation, hashed password, and returns an auth token
    public AuthResponse register(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request payload cannot be empty");
        }

        // Validate username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        String username = request.getUsername().trim();
        if (username.length() < 3 || username.length() > 30) {
            throw new IllegalArgumentException("Username must be between 3 and 30 characters");
        }
        if (!username.matches("^[a-zA-Z0-9_.-]+$")) {
            throw new IllegalArgumentException("Username can only contain alphanumeric characters, dots, underscores, and dashes");
        }

        // Validate email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        String email = request.getEmail().trim().toLowerCase();
        if (!email.matches("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")) {
            throw new IllegalArgumentException("Please provide a valid email address");
        }

        // Validate password
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }

        // Validate uniqueness
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Hash the plain text password with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Pick a random brutalist avatar preset for the new student
        String randomAvatar = avatarService.getRandomAvatarUrl();

        // First registered user automatically becomes the platform administrator (ROLE_ADMIN)
        boolean isFirstUser = userRepository.count() == 0;
        User user = new User(username, email, hashedPassword);
        if (isFirstUser) {
            user.setRole(UserRole.ROLE_ADMIN);
        }
        user.setAvatarUrl(randomAvatar);
        userRepository.save(user);

        // Generate a JWT token for immediate login
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getAvatarUrl());
    }

    // Authenticates an existing user and returns an auth token
    public AuthResponse login(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String username = request.getUsername().trim();

        // Look up the user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // Verify the provided password matches the hashed password in the database
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Check if the account has been banned by an administrator
        if (user.isBanned()) {
            throw new IllegalArgumentException("This account has been suspended or banned by an administrator.");
        }

        // Ensure user has a valid avatar (assign fallback if previous account had null avatar)
        String avatarUrl = user.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isBlank()) {
            avatarUrl = avatarService.getFallbackAvatarForUsername(user.getUsername());
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
        }

        // Generate a JWT token for the authenticated user
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name(), avatarUrl);
    }
}
