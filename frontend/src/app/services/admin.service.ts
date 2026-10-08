import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats, AdminUser } from '../models/admin.models';
import { ReportResponse } from '../models/report.models';
import { Post } from '../models/post.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // Fetch dashboard summary metrics (users, posts, reports, banned)
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  // Fetch all pending moderation reports
  getReports(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(`${this.apiUrl}/reports`);
  }

  // Dismiss / delete a moderation report
  dismissReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${id}`);
  }

  // Fetch all registered users for administration
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  // Toggle ban status for a user
  toggleBanUser(id: number): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/users/${id}/ban`, {});
  }

  // Permanently delete a user with full cascading cleanup
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Fetch all posts for administration
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  // Toggle hide / visibility status of a post
  toggleHidePost(id: number): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}/hide`, {});
  }

  // Permanently delete a post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
