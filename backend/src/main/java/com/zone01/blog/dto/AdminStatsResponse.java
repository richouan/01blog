package com.zone01.blog.dto;

// DTO providing platform metrics for the admin dashboard
public class AdminStatsResponse {

    private long totalUsers;
    private long totalPosts;
    private long totalReports;
    private long bannedUsers;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalPosts, long totalReports, long bannedUsers) {
        this.totalUsers = totalUsers;
        this.totalPosts = totalPosts;
        this.totalReports = totalReports;
        this.bannedUsers = bannedUsers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalPosts() {
        return totalPosts;
    }

    public void setTotalPosts(long totalPosts) {
        this.totalPosts = totalPosts;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getBannedUsers() {
        return bannedUsers;
    }

    public void setBannedUsers(long bannedUsers) {
        this.bannedUsers = bannedUsers;
    }
}
