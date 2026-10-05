package com.zone01.blog.config;

import com.zone01.blog.entity.User;
import com.zone01.blog.entity.UserRole;
import com.zone01.blog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Seeds an initial administrator account on startup if none exists
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default administrator for audit review and admin dashboard access
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@01blog.com",
                    passwordEncoder.encode("Admin123!")
            );
            admin.setRole(UserRole.ROLE_ADMIN);
            userRepository.save(admin);
        }
    }
}
