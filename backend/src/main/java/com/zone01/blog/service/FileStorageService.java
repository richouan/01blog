package com.zone01.blog.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads");

    public FileStorageService() {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create uploads folder: " + e.getMessage());
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        // Whitelist allowed media types
        if (!extension.matches("^\\.(png|jpg|jpeg|gif|webp|mp4|webm)$")) {
            throw new IllegalArgumentException("Only images and videos are allowed.");
        }

        // UUID prevents filename collisions
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path targetLocation = this.uploadDir.resolve(uniqueFilename);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            String filename = fileUrl.replace("/uploads/", "").trim();
            Path filePath = this.uploadDir.resolve(filename).normalize();

            // Prevent path traversal
            if (filePath.startsWith(this.uploadDir)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            System.err.println("Could not delete file: " + fileUrl);
        }
    }
}
