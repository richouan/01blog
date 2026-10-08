// Admin Dashboard Models

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  bannedUsers: number;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  postsCount: number;
  createdAt: string;
}
