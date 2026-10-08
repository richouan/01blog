// Data contracts matching backend DTOs

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface CurrentUser {
  username: string;
  role: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  following?: boolean;
  privateProfile?: boolean;
  hasPendingRequest?: boolean;
}

export interface FollowRequestItem {
  id: number;
  requesterId: number;
  requesterUsername: string;
  createdAt: string;
}



