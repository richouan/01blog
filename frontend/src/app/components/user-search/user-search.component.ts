import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile, CurrentUser } from '../../models/auth.models';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent implements OnInit, OnDestroy {
  searchQuery = '';
  results: UserProfile[] = [];
  isLoading = false;
  hasSearched = false;
  errorMessage = '';
  currentUser: CurrentUser | null = null;
  togglingUsernames: Set<string> = new Set();

  private searchSubject = new Subject<string>();
  private sub = new Subscription();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Debounce search input to avoid hitting backend on every single keystroke
    this.sub.add(
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(query => {
        this.performSearch(query);
      })
    );

    // Read query parameter from URL (e.g. /search?q=richouan)
    this.sub.add(
      this.route.queryParams.subscribe(params => {
        const q = params['q'] || '';
        this.searchQuery = q;
        if (q.trim()) {
          this.performSearch(q);
        }
      })
    );
  }

  getMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const clean = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:8080${clean}`;
  }

  onQueryChange(value: string): void {
    this.searchSubject.next(value);
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: this.searchQuery },
        queryParamsHandling: 'merge'
      });
      this.performSearch(this.searchQuery);
    }
  }

  performSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) {
      this.results = [];
      this.hasSearched = false;
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.userService.searchUsers(trimmed).subscribe({
      next: (users) => {
        users.forEach(u => {
          if (u.isFollowing === undefined && u.following !== undefined) {
            u.isFollowing = u.following;
          }
        });
        this.results = users;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to search users. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleFollow(user: UserProfile): void {
    if (this.togglingUsernames.has(user.username)) return;
    this.togglingUsernames.add(user.username);

    // If there is already a pending request, clicking cancels it
    if (user.hasPendingRequest) {
      this.userService.unfollowUser(user.username).subscribe({
        next: () => {
          user.hasPendingRequest = false;
          this.togglingUsernames.delete(user.username);
          this.cdr.detectChanges();
        },
        error: () => {
          this.togglingUsernames.delete(user.username);
          this.cdr.detectChanges();
        }
      });
      return;
    }

    if (!user.isFollowing) {
      this.userService.followUser(user.username).subscribe({
        next: (res) => {
          if (res.requested) {
            user.hasPendingRequest = true;
            user.isFollowing = false;
          } else {
            user.isFollowing = true;
            user.hasPendingRequest = false;
            user.followersCount = (user.followersCount || 0) + 1;
          }
          this.togglingUsernames.delete(user.username);
          this.cdr.detectChanges();
        },
        error: () => {
          this.togglingUsernames.delete(user.username);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.userService.unfollowUser(user.username).subscribe({
        next: () => {
          user.isFollowing = false;
          user.hasPendingRequest = false;
          if (user.followersCount > 0) {
            user.followersCount -= 1;
          }
          this.togglingUsernames.delete(user.username);
          this.cdr.detectChanges();
        },
        error: () => {
          this.togglingUsernames.delete(user.username);
          this.cdr.detectChanges();
        }
      });
    }
  }

  isCurrentUser(username: string): boolean {
    return this.currentUser?.username === username;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
