import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CurrentUser, UserProfile, FollowRequestItem } from '../../models/auth.models';
import { Post } from '../../models/post.models';
import { PostListComponent } from '../post-list/post-list.component';
import { ReportModalComponent } from '../report-modal/report-modal.component';

// UserProfileComponent displays personal or other students' Profile pages
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, PostListComponent, ReportModalComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  profile: UserProfile | null = null;
  userPosts: Post[] = [];
  isOwnProfile = true;
  isFollowing = false;
  hasPendingRequest = false;
  isTogglingFollow = false;
  isReportModalOpen = false;
  isLoading = true;
  isLoadingPosts = false;
  errorMessage = '';
  activeTab: 'posts' | 'requests' = 'posts';
  copiedLink = false;
  actionMessage = '';
  isTogglingPrivacy = false;

  pendingRequests: FollowRequestItem[] = [];
  isLoadingRequests = false;

  // Avatar Modal State
  isAvatarModalOpen = false;
  presetAvatars: string[] = [];
  selectedPreset = '';
  isUploadingAvatar = false;
  avatarUploadError = '';
  customAvatarFile: File | null = null;
  customAvatarPreview = '';

  private sub = new Subscription();

  get isPrivateLocked(): boolean {
    if (this.isOwnProfile) return false;
    if (this.currentUser?.role === 'ROLE_ADMIN') return false;
    return !!this.profile?.privateProfile && !this.isFollowing;
  }

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

    // Listen to query parameters (e.g. ?tab=requests from notification bell)
    this.sub.add(
      this.route.queryParamMap.subscribe(params => {
        const tab = params.get('tab');
        if (tab === 'requests' || tab === 'posts') {
          this.activeTab = tab;
          this.cdr.detectChanges();
        }
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
    this.hasPendingRequest = false;
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
            if (data.privateProfile) {
              this.loadPendingRequests();
            }
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
            this.hasPendingRequest = !!data.hasPendingRequest;
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

  // Load incoming follow requests for private profiles
  loadPendingRequests(): void {
    if (!this.isOwnProfile) return;
    this.isLoadingRequests = true;
    this.sub.add(
      this.userService.getPendingFollowRequests().subscribe({
        next: (requests) => {
          this.pendingRequests = requests || [];
          this.isLoadingRequests = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Could not load pending follow requests', err);
          this.isLoadingRequests = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  // Accept a pending follow request
  acceptRequest(request: FollowRequestItem): void {
    this.userService.acceptFollowRequest(request.id).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
        if (this.profile) {
          this.profile.followersCount = (this.profile.followersCount || 0) + 1;
        }
        this.actionMessage = `Accepted @${request.requesterUsername}'s follow request!`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not accept follow request.';
        this.cdr.detectChanges();
      }
    });
  }

  // Reject / decline a pending follow request
  rejectRequest(request: FollowRequestItem): void {
    this.userService.rejectFollowRequest(request.id).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
        this.actionMessage = `Declined @${request.requesterUsername}'s follow request.`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not decline follow request.';
        this.cdr.detectChanges();
      }
    });
  }

  // Follow / Subscribe action toggle connected to backend API
  onToggleFollow(): void {
    if (!this.profile?.username || this.isTogglingFollow) return;
    this.isTogglingFollow = true;
    const targetUsername = this.profile.username;

    // If user currently has a pending follow request, clicking cancels it
    if (this.hasPendingRequest) {
      this.userService.unfollowUser(targetUsername).subscribe({
        next: () => {
          this.hasPendingRequest = false;
          this.actionMessage = `Follow request cancelled.`;
          this.isTogglingFollow = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.actionMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Could not cancel follow request.';
          this.isTogglingFollow = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    if (!this.isFollowing) {
      this.userService.followUser(targetUsername).subscribe({
        next: (res) => {
          if (res.requested) {
            this.hasPendingRequest = true;
            this.isFollowing = false;
            this.actionMessage = `Follow request sent to @${targetUsername}!`;
          } else {
            this.isFollowing = true;
            this.hasPendingRequest = false;
            if (this.profile) {
              this.profile.followersCount = (this.profile.followersCount || 0) + 1;
              this.profile.isFollowing = true;
            }
            this.actionMessage = `Subscribed to @${targetUsername}'s profile!`;
            // Reload posts so private posts become visible immediately
            this.loadUserPosts(targetUsername);
          }
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
          this.hasPendingRequest = false;
          if (this.profile) {
            if (this.profile.followersCount > 0) {
              this.profile.followersCount -= 1;
            }
            this.profile.isFollowing = false;
          }
          this.actionMessage = `Unsubscribed from @${targetUsername}.`;
          this.isTogglingFollow = false;
          // If profile is private, immediately empty posts so lock screen appears
          if (this.profile?.privateProfile && this.currentUser?.role !== 'ROLE_ADMIN') {
            this.userPosts = [];
          }
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

  // Toggle account privacy (public vs private) for own profile
  togglePrivacy(): void {
    if (!this.profile || this.isTogglingPrivacy) return;
    this.isTogglingPrivacy = true;
    const nextStatus = !this.profile.privateProfile;
    this.userService.togglePrivacy(nextStatus).subscribe({
      next: (updated) => {
        if (this.profile) {
          this.profile.privateProfile = updated.privateProfile;
        }
        this.isTogglingPrivacy = false;
        this.actionMessage = updated.privateProfile
          ? 'Profile is now PRIVATE. Other students must request to follow.'
          : 'Profile is now PUBLIC. Any student can see your posts.';
        if (updated.privateProfile) {
          this.loadPendingRequests();
        } else {
          this.pendingRequests = [];
        }
        this.cdr.detectChanges();
        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile privacy.';
        this.isTogglingPrivacy = false;
        this.cdr.detectChanges();
      }
    });
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

  // Switch between Posts and Requests tabs
  setActiveTab(tab: 'posts' | 'requests'): void {
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

  // --- MODERATION REPORT MODAL CONTROLS ---
  openReportModal(): void {
    this.isReportModalOpen = true;
  }

  closeReportModal(): void {
    this.isReportModalOpen = false;
  }

  onReportSubmitted(): void {
    this.actionMessage = 'Moderation report submitted to administrators.';
    setTimeout(() => {
      this.actionMessage = '';
      this.cdr.detectChanges();
    }, 4000);
    this.cdr.detectChanges();
  }

  // --- AVATAR MANAGEMENT CONTROLS ---
  getMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const clean = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:8080${clean}`;
  }

  openAvatarModal(): void {
    this.isAvatarModalOpen = true;
    this.avatarUploadError = '';
    this.customAvatarFile = null;
    this.customAvatarPreview = '';
    this.selectedPreset = this.profile?.avatarUrl || '';

    if (this.presetAvatars.length === 0) {
      this.userService.getPresetAvatars().subscribe({
        next: (presets) => {
          this.presetAvatars = presets;
          this.cdr.detectChanges();
        },
        error: () => {
          this.presetAvatars = Array.from({ length: 10 }, (_, i) => `/uploads/avatars/brutalist-${i + 1}.svg`);
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeAvatarModal(): void {
    if (this.isUploadingAvatar) return;
    this.isAvatarModalOpen = false;
    this.customAvatarFile = null;
    this.customAvatarPreview = '';
    this.avatarUploadError = '';
  }

  selectPreset(url: string): void {
    this.selectedPreset = url;
    this.customAvatarFile = null;
    this.customAvatarPreview = '';
    this.avatarUploadError = '';
  }

  rollRandomPreset(): void {
    if (this.presetAvatars.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.presetAvatars.length);
    this.selectedPreset = this.presetAvatars[randomIndex];
    this.customAvatarFile = null;
    this.customAvatarPreview = '';
    this.avatarUploadError = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.avatarUploadError = 'Image file must be smaller than 5MB.';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.avatarUploadError = 'Only image files (.png, .jpg, .jpeg, .webp, .gif) are supported.';
      return;
    }

    this.customAvatarFile = file;
    this.avatarUploadError = '';
    this.customAvatarPreview = URL.createObjectURL(file);
  }

  saveAvatar(): void {
    if (this.isUploadingAvatar) return;

    if (this.customAvatarFile) {
      this.isUploadingAvatar = true;
      this.avatarUploadError = '';
      this.userService.uploadAvatar(this.customAvatarFile).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          if (updatedProfile.avatarUrl) {
            this.authService.updateAvatar(updatedProfile.avatarUrl);
          }
          this.isUploadingAvatar = false;
          this.closeAvatarModal();
          this.actionMessage = 'Profile picture updated successfully!';
          setTimeout(() => {
            this.actionMessage = '';
            this.cdr.detectChanges();
          }, 3500);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isUploadingAvatar = false;
          this.avatarUploadError = err.error?.message || 'Failed to upload profile picture.';
          this.cdr.detectChanges();
        }
      });
    } else if (this.selectedPreset) {
      this.isUploadingAvatar = true;
      this.avatarUploadError = '';
      this.userService.selectPresetAvatar(this.selectedPreset).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          if (updatedProfile.avatarUrl) {
            this.authService.updateAvatar(updatedProfile.avatarUrl);
          }
          this.isUploadingAvatar = false;
          this.closeAvatarModal();
          this.actionMessage = 'Avatar preset updated successfully!';
          setTimeout(() => {
            this.actionMessage = '';
            this.cdr.detectChanges();
          }, 3500);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isUploadingAvatar = false;
          this.avatarUploadError = err.error?.message || 'Failed to update avatar preset.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
