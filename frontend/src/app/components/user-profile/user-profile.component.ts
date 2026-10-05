import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CurrentUser, UserProfile } from '../../models/auth.models';

// UserProfileComponent displays personal or other students' Block pages
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  profile: UserProfile | null = null;
  isOwnProfile = true;
  isFollowing = false;
  isLoading = true;
  errorMessage = '';
  activeTab: 'posts' | 'about' = 'posts';
  copiedLink = false;
  actionMessage = '';
  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    private userService: UserService,
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

  // Load profile data from backend based on route parameter
  loadProfile(targetUsername?: string | null): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.actionMessage = '';
    this.cdr.detectChanges();

    const loggedInUsername = this.authService.getCurrentUser()?.username;

    // Check if viewing own profile or another student's block
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
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || `Student block '@${targetUsername}' not found.`;
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        })
      );
    }
  }

  // Follow / Subscribe action toggle (ready for Day 4 social backend integration)
  onToggleFollow(): void {
    this.isFollowing = !this.isFollowing;
    this.actionMessage = this.isFollowing
      ? `Subscribed to @${this.profile?.username}'s block!`
      : `Unsubscribed from @${this.profile?.username}.`;
    setTimeout(() => {
      this.actionMessage = '';
      this.cdr.detectChanges();
    }, 3000);
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

