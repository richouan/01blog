package com.zone01.blog.entity;

/**
 * Defines the user permission levels in 01Blog.
 * Spring Security uses the "ROLE_" prefix convention for role-based authorization.
 */
public enum UserRole {
    ROLE_USER,  // Regular student user
    ROLE_ADMIN  // Platform administrator with moderation permissions
}
