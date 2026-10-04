package com.zone01.blog.service;

import com.zone01.blog.config.JwtUtil;
import com.zone01.blog.dto.AuthResponse;
import com.zone01.blog.dto.LoginRequest;
import com.zone01.blog.dto.RegisterRequest;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Handles user registration, login authentication, and JWT token issuance
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Constructor injection for required dependencies
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Registers a new user with hashed password and returns an auth token
    public AuthResponse register(RegisterRequest request) {
        // Validate that the username is not already taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Validate that the email is not already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Hash the plain text password with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Create and persist the new user entity
        User user = new User(request.getUsername(), request.getEmail(), hashedPassword);
        userRepository.save(user);

        // Generate a JWT token for immediate login
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    // Authenticates an existing user and returns an auth token
    public AuthResponse login(LoginRequest request) {
        // Look up the user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // Verify the provided password matches the hashed password in the database
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Generate a JWT token for the authenticated user
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}
