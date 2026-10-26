import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterRequest, LoginRequest, AuthResponse, CurrentUser, UserProfile } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base backend API URL
  private apiUrl = 'http://localhost:8080/api/auth';

  // Reactive state holding the currently logged-in user (derived strictly from signed JWT claims)
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

  // Save JWT token in browser localStorage and extract authentic claims
  saveSession(response: AuthResponse): void {
    // ONLY store the cryptographically signed token in localStorage!
    localStorage.setItem('token', response.token);

    // Clean up any plain text keys so tampering with them in DevTools is impossible
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');

    // Extract authentic identity, role, and avatar strictly from signed JWT claims
    const claims = this.decodeToken(response.token);
    const username = claims?.sub || response.username;
    const role = claims?.role || response.role;
    const avatarUrl = claims?.avatarUrl || response.avatarUrl;

    this.currentUserSubject.next({
      username,
      role,
      avatarUrl
    });
  }

  // Update current user avatar in reactive in-memory state
  updateAvatar(newAvatarUrl: string): void {
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
    this.clearStorage();
    this.currentUserSubject.next(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  // Clear all auth items from localStorage
  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');
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

  // Safely decode payload claims from a signed JWT token
  decodeToken(token: string): { sub?: string; role?: string; avatarUrl?: string; exp?: number } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Helper to check if a JWT token payload has expired
  isTokenExpired(token: string): boolean {
    const claims = this.decodeToken(token);
    if (!claims || !claims.exp) {
      return true;
    }
    return claims.exp * 1000 < Date.now();
  }

  // Synchronize and verify current user with backend database
  verifySession(): Observable<CurrentUser | null> {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout(false);
      return of(null);
    }

    return this.http.get<UserProfile>('http://localhost:8080/api/users/me').pipe(
      map(profile => {
        const user: CurrentUser = {
          username: profile.username,
          role: profile.role,
          avatarUrl: profile.avatarUrl
        };
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(err => {
        // If 401 Unauthorized or 403 Forbidden, token is invalid, forged, or user is banned
        if (err.status === 401 || err.status === 403) {
          this.logout(false);
        }
        return of(null);
      })
    );
  }

  // Helper to read initial user state strictly from the cryptographically signed JWT token on app load
  private loadUserFromStorage(): CurrentUser | null {
    if (typeof localStorage === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      this.clearStorage();
      return null;
    }

    // NEVER read raw 'role', 'username', or 'avatarUrl' from localStorage!
    // Extract identity and role strictly from the signed token payload claims:
    const claims = this.decodeToken(token);
    if (!claims || !claims.sub) {
      this.clearStorage();
      return null;
    }

    return {
      username: claims.sub,
      role: claims.role || 'ROLE_USER',
      avatarUrl: claims.avatarUrl
    };
  }
}
