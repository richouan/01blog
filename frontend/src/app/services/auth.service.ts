import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterRequest, LoginRequest, AuthResponse, CurrentUser } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base backend API URL
  private apiUrl = 'http://localhost:8080/api/auth';

  // Reactive state holding the currently logged-in user
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.loadUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Send registration request to backend
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.saveSession(response))
    );
  }

  // Send login request to backend
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.saveSession(response))
    );
  }

  // Save JWT token and user info in browser localStorage
  saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('role', response.role);

    this.currentUserSubject.next({
      username: response.username,
      role: response.role
    });
  }

  // Clear session on logout and redirect to login page
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Retrieve stored JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is currently authenticated
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if logged-in user has admin privileges
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ROLE_ADMIN';
  }

  // Get current user value synchronously
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  // Helper to read initial user state from localStorage on app load
  private loadUserFromStorage(): CurrentUser | null {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      return { username, role };
    }
    return null;
  }
}
