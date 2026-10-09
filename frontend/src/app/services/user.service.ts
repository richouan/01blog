import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, FollowRequestItem } from '../models/auth.models';

// Service to fetch user profile details and handle social interactions from Spring Boot backend
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Fetch current authenticated user's profile from JWT context
  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  // Fetch public profile of any user by username (for user profile page)
  getUserProfile(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${username}`);
  }

  followUser(username: string): Observable<{ message: string; following: boolean; requested?: boolean }> {
    return this.http.post<{ message: string; following: boolean; requested?: boolean }>(`${this.apiUrl}/${username}/follow`, {});
  }

  unfollowUser(username: string): Observable<{ message: string; following: boolean; requested?: boolean }> {
    return this.http.post<{ message: string; following: boolean; requested?: boolean }>(`${this.apiUrl}/${username}/unfollow`, {});
  }

  // Search users by partial username
  searchUsers(query: string): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  // Toggle or explicitly set profile privacy (public vs private)
  togglePrivacy(privateProfile?: boolean): Observable<UserProfile> {
    const body = privateProfile !== undefined ? { privateProfile } : {};
    return this.http.put<UserProfile>(`${this.apiUrl}/me/privacy`, body);
  }

  // Fetch pending follow requests received by the current user
  getPendingFollowRequests(): Observable<FollowRequestItem[]> {
    return this.http.get<FollowRequestItem[]>(`${this.apiUrl}/requests/pending`);
  }

  // Accept a pending follow request
  acceptFollowRequest(requestId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/requests/${requestId}/accept`, {});
  }

  // Reject a pending follow request
  rejectFollowRequest(requestId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/requests/${requestId}/reject`, {});
  }

  // Fetch list of all preset brutalist avatars
  getPresetAvatars(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/avatars/presets`);
  }

  // Upload a custom profile picture image file
  uploadAvatar(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UserProfile>(`${this.apiUrl}/me/avatar`, formData);
  }

  // Choose a preset brutalist avatar from the gallery
  selectPresetAvatar(avatarUrl: string): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me/avatar/preset`, { avatarUrl });
  }
}
