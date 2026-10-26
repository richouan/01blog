package com.zone01.blog.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

// Helper to create and verify JWT tokens
@Component
public class JwtUtil {

    // Read secret and expiration from application.properties
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    // Convert secret string into cryptographic key for HMAC-SHA256
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Create a token valid for 24h with username as the subject and role in claims
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Overload for backward compatibility
    public String generateToken(String username) {
        return generateToken(username, "ROLE_USER");
    }

    // Get the username stored inside the token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract user role stored in token claims
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Check if token signature is valid and not expired
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Extract payload claims (throws exception if token is tampered or expired)
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
