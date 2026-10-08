import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminStats, AdminUser } from '../../models/admin.models';
import { ReportResponse } from '../../models/report.models';
import { Post } from '../../models/post.models';

type AdminTab = 'reports' | 'users' | 'posts';

interface ConfirmActionState {
  type: 'ban' | 'unban' | 'deleteUser' | 'deletePost' | 'toggleHide' | 'dismissReport';
  targetId: number;
  targetName: string;
  title: string;
  warning: string;
  confirmBtnText: string;
  isDestructive: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: AdminTab = 'reports';

  // Stats
  stats: AdminStats = {
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    bannedUsers: 0
  };
  isLoadingStats = false;

  // Tab Data
  reports: ReportResponse[] = [];
  users: AdminUser[] = [];
  posts: Post[] = [];

  isLoadingData = false;
  searchFilter = '';

  // Confirmation Modal State
  confirmModal: ConfirmActionState | null = null;
  isProcessingAction = false;

  // Alerts
  successToast = '';
  errorAlert = '';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadAllData();
  }

  // Switch active moderation tab
  setTab(tab: AdminTab): void {
    this.activeTab = tab;
    this.searchFilter = '';
    this.errorAlert = '';
  }

  // Load platform analytics metrics
  loadStats(): void {
    this.isLoadingStats = true;
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingStats = false;
        this.errorAlert = 'Failed to load platform stats: ' + (err.error?.message || err.message);
        this.cdr.detectChanges();
      }
    });
  }

  // Preload all moderation entities so tab counts and switches are instant
  loadAllData(): void {
    this.isLoadingData = true;
    this.errorAlert = '';

    let pending = 3;
    const checkDone = () => {
      pending--;
      if (pending <= 0) {
        this.isLoadingData = false;
        this.cdr.detectChanges();
      }
    };

    this.adminService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        checkDone();
      },
      error: (err) => {
        this.errorAlert = 'Failed to load reports: ' + (err.error?.message || err.message);
        checkDone();
      }
    });

    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        checkDone();
      },
      error: (err) => {
        this.errorAlert = 'Failed to load users: ' + (err.error?.message || err.message);
        checkDone();
      }
    });

    this.adminService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        checkDone();
      },
      error: (err) => {
        this.errorAlert = 'Failed to load publications: ' + (err.error?.message || err.message);
        checkDone();
      }
    });
  }

  // Instant accurate tab counts
  get reportsTabCount(): number {
    if (this.searchFilter.trim()) return this.filteredReports.length;
    return this.reports.length || this.stats.totalReports;
  }

  get usersTabCount(): number {
    if (this.searchFilter.trim()) return this.filteredUsers.length;
    return this.users.length || this.stats.totalUsers;
  }

  get postsTabCount(): number {
    if (this.searchFilter.trim()) return this.filteredPosts.length;
    return this.posts.length || this.stats.totalPosts;
  }

  // Filtered views for search input
  get filteredReports(): ReportResponse[] {
    if (!this.searchFilter.trim()) return this.reports;
    const q = this.searchFilter.toLowerCase();
    return this.reports.filter(r =>
      r.reporterUsername.toLowerCase().includes(q) ||
      (r.reportedUsername && r.reportedUsername.toLowerCase().includes(q)) ||
      (r.reportedPostTitle && r.reportedPostTitle.toLowerCase().includes(q)) ||
      r.reason.toLowerCase().includes(q)
    );
  }

  get filteredUsers(): AdminUser[] {
    if (!this.searchFilter.trim()) return this.users;
    const q = this.searchFilter.toLowerCase();
    return this.users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  get filteredPosts(): Post[] {
    if (!this.searchFilter.trim()) return this.posts;
    const q = this.searchFilter.toLowerCase();
    return this.posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.authorUsername.toLowerCase().includes(q)
    );
  }

  // --- ACTION CONFIRMATION MODAL TRIGGERS ---

  promptDismissReport(report: ReportResponse): void {
    this.confirmModal = {
      type: 'dismissReport',
      targetId: report.id,
      targetName: `Report #${report.id} against ${report.targetType === 'USER' ? '@' + report.reportedUsername : report.reportedPostTitle}`,
      title: 'Dismiss Moderation Report',
      warning: 'This report will be permanently removed from the active moderation queue.',
      confirmBtnText: 'Dismiss Report',
      isDestructive: false
    };
  }

  promptToggleBan(user: AdminUser): void {
    const isBanning = !user.banned;
    this.confirmModal = {
      type: isBanning ? 'ban' : 'unban',
      targetId: user.id,
      targetName: `@${user.username}`,
      title: isBanning ? 'Ban Student Account' : 'Lift Account Ban',
      warning: isBanning
        ? 'Banned students cannot log in, publish posts, leave comments, or like content until unbanned.'
        : 'The student will regain standard access to log in and interact with the platform.',
      confirmBtnText: isBanning ? 'Confirm Account Ban' : 'Lift Ban',
      isDestructive: isBanning
    };
  }

  promptDeleteUser(user: AdminUser): void {
    this.confirmModal = {
      type: 'deleteUser',
      targetId: user.id,
      targetName: `@${user.username}`,
      title: 'Permanently Delete User Account',
      warning: 'CRITICAL ACTION: This executes a 6-stage cascade deleting this user, all their publications, comments, likes, notifications, and subscription links. Cannot be undone!',
      confirmBtnText: 'Delete User Permanently',
      isDestructive: true
    };
  }

  promptToggleHide(post: Post): void {
    const willHide = !post.hidden;
    this.confirmModal = {
      type: 'toggleHide',
      targetId: post.id,
      targetName: `"${post.title}"`,
      title: willHide ? 'Hide Publication' : 'Restore Publication',
      warning: willHide
        ? 'Hidden posts are removed from public student feeds while preserved for administrative records.'
        : 'This publication will become visible again to all students on the platform.',
      confirmBtnText: willHide ? 'Hide Post' : 'Unhide Post',
      isDestructive: willHide
    };
  }

  promptDeletePost(post: Post): void {
    this.confirmModal = {
      type: 'deletePost',
      targetId: post.id,
      targetName: `"${post.title}"`,
      title: 'Permanently Delete Publication',
      warning: 'This permanently removes the publication, media attachment files on disk, and associated comments.',
      confirmBtnText: 'Delete Publication',
      isDestructive: true
    };
  }

  closeConfirmModal(): void {
    if (this.isProcessingAction) return;
    this.confirmModal = null;
  }

  // Execute confirmed administrative moderation action
  executeConfirmedAction(): void {
    if (!this.confirmModal) return;
    const { type, targetId } = this.confirmModal;
    this.isProcessingAction = true;
    this.errorAlert = '';

    if (type === 'dismissReport') {
      this.adminService.dismissReport(targetId).subscribe({
        next: () => {
          this.reports = this.reports.filter(r => r.id !== targetId);
          this.stats.totalReports = Math.max(0, this.stats.totalReports - 1);
          this.onActionSuccess('Report dismissed successfully.');
        },
        error: (err) => this.onActionError('Failed to dismiss report: ' + (err.error?.message || err.message))
      });
    } else if (type === 'ban' || type === 'unban') {
      this.adminService.toggleBanUser(targetId).subscribe({
        next: (updatedUser) => {
          const idx = this.users.findIndex(u => u.id === targetId);
          if (idx !== -1) this.users[idx] = updatedUser;
          this.loadStats();
          this.onActionSuccess(`User ${updatedUser.username} is now ${updatedUser.banned ? 'banned' : 'active'}.`);
        },
        error: (err) => this.onActionError('Failed to toggle ban: ' + (err.error?.message || err.message))
      });
    } else if (type === 'deleteUser') {
      this.adminService.deleteUser(targetId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== targetId);
          this.loadStats();
          this.onActionSuccess('User account and all relational data permanently removed.');
        },
        error: (err) => this.onActionError('Failed to delete user: ' + (err.error?.message || err.message))
      });
    } else if (type === 'toggleHide') {
      this.adminService.toggleHidePost(targetId).subscribe({
        next: (updatedPost) => {
          const idx = this.posts.findIndex(p => p.id === targetId);
          if (idx !== -1) this.posts[idx] = updatedPost;
          this.onActionSuccess(`Post is now ${updatedPost.hidden ? 'hidden from public feeds' : 'visible'}.`);
        },
        error: (err) => this.onActionError('Failed to toggle post visibility: ' + (err.error?.message || err.message))
      });
    } else if (type === 'deletePost') {
      this.adminService.deletePost(targetId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== targetId);
          this.loadStats();
          this.onActionSuccess('Publication permanently deleted.');
        },
        error: (err) => this.onActionError('Failed to delete post: ' + (err.error?.message || err.message))
      });
    }
  }

  private onActionSuccess(message: string): void {
    this.isProcessingAction = false;
    this.confirmModal = null;
    this.successToast = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successToast = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  private onActionError(message: string): void {
    this.isProcessingAction = false;
    this.errorAlert = message;
    this.cdr.detectChanges();
  }
}
