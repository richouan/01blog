import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CurrentUser, UserProfile } from '../../models/auth.models';
import { Post } from '../../models/post.models';
import { PostListComponent } from '../post-list/post-list.component';

// UserProfileComponent displays personal or other students' Profile pages
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, PostListComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  profile: UserProfile | null = null;
  userPosts: Post[] = [];
  isOwnProfile = true;
  isFollowing = false;
  isTogglingFollow = false;
  isLoading = true;
  isLoadingPosts = false;
  errorMessage = '';
  activeTab: 'posts' | 'about' = 'posts';
  copiedLink = false;
  actionMessage = '';
  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Listen to current logged-in user state
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.cdr.detectChanges();
      })
    );

    // Listen to route parameter changes (e.g. /profile vs /profile/:username)
    this.sub.add(
      this.route.paramMap.subscribe(params => {
        const targetUsername = params.get('username');
        this.loadProfile(targetUsername);
      })
    );
  }

  // Load profile data and posts from backend based on route parameter
  loadProfile(targetUsername?: string | null): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.actionMessage = '';
    this.userPosts = [];
    this.cdr.detectChanges();

    const loggedInUsername = this.authService.getCurrentUser()?.username;
    const usernameToFetch = targetUsername || loggedInUsername;

    // Check if viewing own profile or another student's profile
    if (!targetUsername || targetUsername === loggedInUsername) {
      this.isOwnProfile = true;
      this.sub.add(
        this.userService.getCurrentUser().subscribe({
          next: (data) => {
            this.profile = data;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Could not load your profile details from server.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        })
      );
    } else {
      this.isOwnProfile = false;
      this.sub.add(
        this.userService.getUserProfile(targetUsername).subscribe({
          next: (data) => {
            this.profile = data;
            this.isFollowing = !!(data.isFollowing ?? data.following);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || `Student profile '@${targetUsername}' not found.`;
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        })
      );
    }

    if (usernameToFetch) {
      this.loadUserPosts(usernameToFetch);
    }
  }

  // Fetch timeline posts published by this specific user
  loadUserPosts(username: string): void {
    this.isLoadingPosts = true;
    this.sub.add(
      this.postService.getUserPosts(username).subscribe({
        next: (posts) => {
          this.userPosts = posts || [];
          this.isLoadingPosts = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Could not load user posts', err);
          this.userPosts = [];
          this.isLoadingPosts = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  // Follow / Subscribe action toggle connected to backend API
  onToggleFollow(): void {
    if (!this.profile?.username || this.isTogglingFollow) return;
    this.isTogglingFollow = true;
    const targetUsername = this.profile.username;

    if (!this.isFollowing) {
      this.userService.followUser(targetUsername).subscribe({
        next: () => {
          this.isFollowing = true;
          if (this.profile) {
            this.profile.followersCount = (this.profile.followersCount || 0) + 1;
          }
          this.actionMessage = `Subscribed to @${targetUsername}'s profile!`;
          this.isTogglingFollow = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.actionMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Could not subscribe to user.';
          this.isTogglingFollow = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.userService.unfollowUser(targetUsername).subscribe({
        next: () => {
          this.isFollowing = false;
          if (this.profile && this.profile.followersCount > 0) {
            this.profile.followersCount -= 1;
          }
          this.actionMessage = `Unsubscribed from @${targetUsername}.`;
          this.isTogglingFollow = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.actionMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Could not unsubscribe from user.';
          this.isTogglingFollow = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Handle post deletion from child PostListComponent
  onPostDeleted(deletedId: number): void {
    this.userPosts = this.userPosts.filter(p => p.id !== deletedId);
    this.cdr.detectChanges();
  }

  // Handle post edit from child PostListComponent
  onPostUpdated(updated: Post): void {
    const idx = this.userPosts.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      const copy = [...this.userPosts];
      copy[idx] = updated;
      this.userPosts = copy;
      this.cdr.detectChanges();
    }
  }

  // Switch between Posts and About tabs
  setActiveTab(tab: 'posts' | 'about'): void {
    this.activeTab = tab;
  }

  // Quick action to copy profile link to clipboard
  copyProfileLink(): void {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.copiedLink = true;
        setTimeout(() => (this.copiedLink = false), 2000);
      }).catch(() => {
        this.fallbackCopy();
      });
    } else {
      this.fallbackCopy();
    }
  }

  private fallbackCopy(): void {
    try {
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      this.copiedLink = true;
      setTimeout(() => (this.copiedLink = false), 2000);
    } catch {
      // Ignore copy error
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
