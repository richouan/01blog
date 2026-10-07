package com.zone01.blog.config;

import com.zone01.blog.entity.User;
import com.zone01.blog.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// Intercepts every HTTP request once to extract and validate the JWT token from the Authorization header
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Inject JwtUtil and UserRepository via constructor
    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Read the Authorization header (e.g. "Bearer eyJhbGciOi...")
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix

            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);

                // Only authenticate if user is not already authenticated in this request context
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User user = userRepository.findByUsername(username).orElse(null);

                    if (user != null && !user.isBanned()) {
                        // Create authority based on user role (e.g. "ROLE_USER" or "ROLE_ADMIN")
                        List<SimpleGrantedAuthority> authorities = List.of(
                                new SimpleGrantedAuthority(user.getRole().name())
                        );

                        // Build authentication token with username string as principal
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                null,
                                authorities
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Store authenticated user in Spring Security context
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        }

        // Pass request to the next filter in the chain
        filterChain.doFilter(request, response);
    }
}
