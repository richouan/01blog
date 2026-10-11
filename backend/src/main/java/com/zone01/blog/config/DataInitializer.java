package com.zone01.blog.config;

import com.zone01.blog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Logs platform startup status; the first registered user becomes the administrator
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            System.out.println("[01Blog] Clean database detected. The first registered user will automatically become Platform Administrator (ROLE_ADMIN).");
        }
    }
}
