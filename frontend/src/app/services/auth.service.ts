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
    if (response.avatarUrl) {
      localStorage.setItem('avatarUrl', response.avatarUrl);
    }

    this.currentUserSubject.next({
      username: response.username,
      role: response.role,
      avatarUrl: response.avatarUrl
    });
  }

  // Update current user avatar in state and storage
  updateAvatar(newAvatarUrl: string): void {
    if (newAvatarUrl) {
      localStorage.setItem('avatarUrl', newAvatarUrl);
    } else {
      localStorage.removeItem('avatarUrl');
    }
    const current = this.currentUserSubject.value;
    if (current) {
      this.currentUserSubject.next({
        ...current,
        avatarUrl: newAvatarUrl
      });
    }
  }

  // Clear session on logout and redirect to login page (unless redirect is false)
  logout(redirect: boolean = true): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');

    this.currentUserSubject.next(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  // Retrieve stored JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is currently authenticated with a valid (unexpired) token
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      if (token) {
        this.logout();
      }
      return false;
    }
    return true;
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

  // Helper to check if a JWT token payload has expired
  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true;
      }
      const payload = JSON.parse(atob(parts[1]));
      if (payload && payload.exp) {
        // exp is in seconds, convert to ms
        return payload.exp * 1000 < Date.now();
      }
      return false;
    } catch {
      return true;
    }
  }

  // Helper to read initial user state from localStorage on app load
  private loadUserFromStorage(): CurrentUser | null {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const avatarUrl = localStorage.getItem('avatarUrl') || undefined;

    if (token && username && role) {
      if (this.isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('avatarUrl');
        return null;
      }
      return { username, role, avatarUrl };
    }
    return null;
  }
}
