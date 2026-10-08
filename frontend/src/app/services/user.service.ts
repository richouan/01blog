import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/auth.models';

// Service to fetch user profile details from Spring Boot backend
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

  followUser(username: string): Observable<{ message: string; following: boolean }> {
    return this.http.post<{ message: string; following: boolean }>(`${this.apiUrl}/${username}/follow`, {});
  }

  unfollowUser(username: string): Observable<{ message: string; following: boolean }> {
    return this.http.post<{ message: string; following: boolean }>(`${this.apiUrl}/${username}/unfollow`, {});
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
}


