import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription, filter, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { CurrentUser } from '../../models/auth.models';
import { NotificationItem } from '../../models/notification.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  searchQuery = '';
  isUserDropdownOpen = false;
  isShortcutsModalOpen = false;

  // Notification center state
  unreadCount = 0;
  isNotificationDropdownOpen = false;
  notifications: NotificationItem[] = [];
  isLoadingNotifications = false;

  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleAvatarThemeSync(): void {
    this.themeService.toggleAvatarColorSync();
  }

  // Returns true if the logged-in user holds ROLE_ADMIN
  get isAdmin(): boolean {
    return this.currentUser?.role === 'ROLE_ADMIN';
  }

  getMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const clean = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:8080${clean}`;
  }

  ngOnInit(): void {
    // Listen to user authentication changes
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.refreshUnreadCount();
        } else {
          this.notifications = [];
          this.unreadCount = 0;
        }
        this.cdr.detectChanges();
      })
    );

    // Listen to reactive unread count updates
    this.sub.add(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
        this.cdr.detectChanges();
      })
    );

    // Light polling for new notifications every 15 seconds when authenticated
    this.sub.add(
      interval(15000).subscribe(() => {
        if (this.currentUser) {
          this.refreshUnreadCount();
        }
      })
    );

    // Listen to route changes to close popovers
    this.sub.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          this.isUserDropdownOpen = false;
          this.isNotificationDropdownOpen = false;
          this.cdr.detectChanges();
        })
    );
  }

  refreshUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.unreadCount;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  // Toggle notification dropdown and fetch notifications when opening
  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    if (this.isNotificationDropdownOpen) {
      this.isUserDropdownOpen = false;
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    this.isLoadingNotifications = true;
    this.notificationService.getNotifications().subscribe({
      next: (list) => {
        this.notifications = list || [];
        this.isLoadingNotifications = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingNotifications = false;
        this.cdr.detectChanges();
      }
    });
  }

  notificationFilter: 'all' | 'unread' = 'all';

  get filteredNotifications(): NotificationItem[] {
    if (this.notificationFilter === 'unread') {
      return this.notifications.filter(n => !n.isRead);
    }
    return this.notifications;
  }

  // Acknowledge individual notification without navigating away
  onMarkItemAsRead(item: NotificationItem, event: MouseEvent): void {
    event.stopPropagation();
    if (item.isRead) return;

    this.notificationService.markAsRead(item.id).subscribe({
      next: () => {
        item.isRead = true;
        item.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notificationService.setUnreadCount(this.unreadCount);
        this.cdr.detectChanges();
      }
    });
  }

  // Acknowledge notification and navigate to relevant target
  onNotificationClick(item: NotificationItem): void {
    if (!item.isRead) {
      this.notificationService.markAsRead(item.id).subscribe({
        next: () => {
          item.isRead = true;
          item.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.notificationService.setUnreadCount(this.unreadCount);
          this.cdr.detectChanges();
        }
      });
    }

    this.isNotificationDropdownOpen = false;

    // Navigate to target student profile or pending requests tab
    if (item.type === 'FOLLOW_REQUEST') {
      this.router.navigate(['/profile'], { queryParams: { tab: 'requests' } });
    } else if (item.actorUsername) {
      this.router.navigate(['/profile', item.actorUsername]);
    }
  }

  // Mark all unread notifications as read
  onMarkAllAsRead(): void {
    if (this.unreadCount === 0) return;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => {
          n.isRead = true;
          n.read = true;
        });
        this.unreadCount = 0;
        this.notificationService.setUnreadCount(0);
        this.cdr.detectChanges();
      }
    });
  }

  toggleShortcutsModal(): void {
    this.isShortcutsModalOpen = !this.isShortcutsModalOpen;
    if (this.isShortcutsModalOpen) {
      this.isUserDropdownOpen = false;
      this.isNotificationDropdownOpen = false;
    }
    this.cdr.detectChanges();
  }

  openShortcutsModal(): void {
    this.isShortcutsModalOpen = true;
    this.isUserDropdownOpen = false;
    this.isNotificationDropdownOpen = false;
    this.cdr.detectChanges();
  }

  closeShortcutsModal(): void {
    this.isShortcutsModalOpen = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (!event || !event.key) {
      return;
    }
    const isCtrlOrCmd = event.metaKey || event.ctrlKey;
    const isSlash = event.key === '/' || event.code === 'Slash';

    // 1. Toggle Shortcuts Modal: Ctrl + / or Cmd + /
    if (isCtrlOrCmd && isSlash) {
      event.preventDefault();
      this.toggleShortcutsModal();
      return;
    }

    // 2. Escape: Dismiss open modal, dropdowns, or blur active inputs
    if (event.key === 'Escape') {
      if (this.isShortcutsModalOpen) {
        this.isShortcutsModalOpen = false;
        this.cdr.detectChanges();
        return;
      }
      if (this.isUserDropdownOpen || this.isNotificationDropdownOpen) {
        this.isUserDropdownOpen = false;
        this.isNotificationDropdownOpen = false;
        this.cdr.detectChanges();
        return;
      }
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        activeEl.blur();
        return;
      }
    }

    // 3. Quick Search: Ctrl + K or Cmd + K
    if (isCtrlOrCmd && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const input = document.getElementById('navSearchInput') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      } else {
        this.router.navigate(['/search']);
      }
      return;
    }

    // Check if user is typing in an active input / textarea
    const activeEl = document.activeElement;
    const isInputActive = activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      (activeEl as HTMLElement).isContentEditable
    );

    if (isInputActive) {
      return;
    }

    // 4. Pressing '?' (Shift + /) opens shortcuts sheet
    if (!isCtrlOrCmd && event.key === '?') {
      event.preventDefault();
      this.toggleShortcutsModal();
      return;
    }

    // 5. Alt + H -> Feed Home
    if (event.altKey && event.key.toLowerCase() === 'h') {
      event.preventDefault();
      this.router.navigate(['/']);
      return;
    }

    // 6. Alt + E -> Explore
    if (event.altKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      this.router.navigate(['/search']);
      return;
    }

    // 7. Alt + P -> My Profile
    if (event.altKey && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      this.router.navigate(['/profile']);
      return;
    }

    // 8. Single key 't' -> Toggle Theme
    if (!isCtrlOrCmd && !event.altKey && event.key.toLowerCase() === 't') {
      event.preventDefault();
      this.toggleTheme();
      return;
    }

    // 9. Single key 'c' -> Create Post Focus
    if (!isCtrlOrCmd && !event.altKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();

      const focusPostCreator = () => {
        let attempts = 0;
        const intervalId = setInterval(() => {
          attempts++;
          const titleInput = document.querySelector('.post-title-input') as HTMLInputElement;
          if (titleInput) {
            clearInterval(intervalId);
            titleInput.focus();
            titleInput.click();
            const card = document.querySelector('.create-post-card') as HTMLElement;
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
          }
          if (attempts >= 20) {
            clearInterval(intervalId);
          }
        }, 50);
      };

      if (this.router.url !== '/') {
        this.router.navigate(['/']).then(() => {
          focusPostCreator();
        });
      } else {
        focusPostCreator();
      }
      return;
    }
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-wrapper')) {
      this.isUserDropdownOpen = false;
    }
    if (!target.closest('.notification-dropdown-wrapper')) {
      this.isNotificationDropdownOpen = false;
    }
  }

  onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.searchQuery = '';
    } else {
      this.router.navigate(['/search']);
    }
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    if (this.isUserDropdownOpen) {
      this.isNotificationDropdownOpen = false;
    }
  }

  isAuthPage(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }

  getRelativeTime(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const past = new Date(dateStr).getTime();
      const now = Date.now();
      const diffSec = Math.floor((now - past) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  }

  onLogout(): void {
    this.isUserDropdownOpen = false;
    this.isNotificationDropdownOpen = false;
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}


