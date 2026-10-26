package com.zone01.blog.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// Minimal in-memory rate limiter protecting the server from DoS flooding & brute-force attacks
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // Thresholds per IP address per 1-minute window
    private static final int AUTH_LIMIT = 20;    // Login & Register attempts per minute
    private static final int GENERAL_LIMIT = 300; // General API requests per minute (allows smooth page refreshes & SPA loads)
    private static final long WINDOW_MS = 60_000L; // 1 minute in milliseconds

    // In-memory counter for request tracking
    private static class RequestTracker {
        long windowStart = System.currentTimeMillis();
        int count = 0;
    }

    private final Map<String, RequestTracker> clientTrackers = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Skip CORS preflight checks, static files, and internal error dispatcher
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String uri = request.getRequestURI();
        if (uri.startsWith("/uploads/") || uri.equals("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Determine client IP and specific endpoint category
        String clientIp = getClientIp(request);
        boolean isAuthEndpoint = uri.startsWith("/api/auth/");
        int maxAllowed = isAuthEndpoint ? AUTH_LIMIT : GENERAL_LIMIT;
        String trackingKey = (isAuthEndpoint ? "AUTH:" : "GEN:") + clientIp;

        if (!isAllowed(trackingKey, maxAllowed)) {
            response.setStatus(429); // 429 Too Many Requests
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Retry-After", "60");
            response.getWriter().write("{\"timestamp\":\"" + LocalDateTime.now() + "\",\"status\":429,\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Too many requests. Please slow down and try again in a minute.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    // Thread-safe rate check with automatic memory cleanup of expired windows
    private synchronized boolean isAllowed(String key, int maxAllowed) {
        long now = System.currentTimeMillis();

        // Memory cleanup: purge stale records if tracker map grows large
        if (clientTrackers.size() > 500) {
            clientTrackers.entrySet().removeIf(e -> now - e.getValue().windowStart > WINDOW_MS);
        }

        RequestTracker tracker = clientTrackers.computeIfAbsent(key, k -> new RequestTracker());

        // Reset counter once the 60-second window expires
        if (now - tracker.windowStart > WINDOW_MS) {
            tracker.windowStart = now;
            tracker.count = 0;
        }

        if (tracker.count >= maxAllowed) {
            return false;
        }

        tracker.count++;
        return true;
    }

    // Resolves client IP, taking proxy headers (e.g. X-Forwarded-For) into account
    private String getClientIp(HttpServletRequest request) {
        String xForwarded = request.getHeader("X-Forwarded-For");
        if (xForwarded != null && !xForwarded.isBlank()) {
            return xForwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
