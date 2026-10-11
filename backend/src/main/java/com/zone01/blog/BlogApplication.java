package com.zone01.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class BlogApplication {

    public static void main(String[] args) {
        loadDotenv();
        // Starts our Spring Boot application
        SpringApplication.run(BlogApplication.class, args);
    }

    // Loads environment variables from gitignored .env into system properties
    private static void loadDotenv() {
        Path path = Files.exists(Paths.get(".env")) ? Paths.get(".env") : Paths.get("../.env");
        if (Files.exists(path)) {
            try (var lines = Files.lines(path)) {
                lines.filter(l -> l.contains("=") && !l.trim().startsWith("#")).forEach(l -> {
                    String[] parts = l.split("=", 2);
                    String key = parts[0].trim();
                    String val = parts[1].trim().replaceAll("^[\"']|[\"']$", "");
                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, val);
                    }
                });
            } catch (Exception ignored) {}
        }
    }
}
