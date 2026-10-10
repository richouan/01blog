import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private readonly AVATAR_SYNC_KEY = 'avatar_theme_sync';

  // Mapping of preset avatar SVGs to their signature Neo-Brutalist accent colors
  private readonly AVATAR_COLORS: Record<string, string> = {
    'brutalist-1.svg': '#FFE600', // 1. Canary Yellow
    'brutalist-2.svg': '#00E599', // 2. Neo Mint
    'brutalist-3.svg': '#FF5C5C', // 3. Coral Red
    'brutalist-4.svg': '#A78BFA', // 4. Electric Lavender / Purple
    'brutalist-5.svg': '#00F0FF', // 5. Cyan Electric
    'brutalist-6.svg': '#FF9900', // 6. Safety Orange
    'brutalist-7.svg': '#70D6FF', // 7. Sky Blue
    'brutalist-8.svg': '#00E599', // 8. Cyber Green
    'brutalist-9.svg': '#FF70A6', // 9. Hot Pink
    'brutalist-10.svg': '#E2F952' // 10. Volt Neon Lime
  };

  // Holds whether dark mode is currently active
  private isDarkSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDark$ = this.isDarkSubject.asObservable();

  // Holds whether dynamic avatar theme sync is enabled (DISABLED BY DEFAULT)
  private isAvatarColorEnabledSubject = new BehaviorSubject<boolean>(this.getInitialAvatarColorSync());
  public isAvatarColorEnabled$ = this.isAvatarColorEnabledSubject.asObservable();

  constructor(private authService: AuthService) {
    // Apply saved theme immediately upon initialization
    this.applyTheme(this.isDarkSubject.value);

    // Reactively update site accent color whenever the user logs in, switches avatars, or logs out
    this.authService.currentUser$.subscribe(user => {
      this.applyAvatarThemeColor(user?.avatarUrl);
    });
  }

  // Synchronous getter for dark mode
  public get isDarkMode(): boolean {
    return this.isDarkSubject.value;
  }

  // Synchronous getter for avatar theme sync
  public get isAvatarColorEnabled(): boolean {
    return this.isAvatarColorEnabledSubject.value;
  }

  // Toggle between light and dark
  public toggleTheme(): void {
    const nextState = !this.isDarkSubject.value;
    this.isDarkSubject.next(nextState);
    this.applyTheme(nextState);
    localStorage.setItem(this.THEME_KEY, nextState ? 'dark' : 'light');
  }

  // Toggle dynamic avatar color matching ON or OFF
  public toggleAvatarColorSync(): void {
    const nextState = !this.isAvatarColorEnabledSubject.value;
    this.isAvatarColorEnabledSubject.next(nextState);
    localStorage.setItem(this.AVATAR_SYNC_KEY, nextState ? 'true' : 'false');

    // Re-apply or reset theme immediately based on new state
    const currentUser = this.authService.getCurrentUser();
    this.applyAvatarThemeColor(currentUser?.avatarUrl);
  }

  // Returns current user's avatar color or canary yellow fallback
  public get currentAvatarColor(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.avatarUrl) return '#FFE600';
    const filename = user.avatarUrl.split('/').pop() || '';
    return this.AVATAR_COLORS[filename] || '#FFE600';
  }

  // Helper to determine initial avatar color sync setting (DISABLED BY DEFAULT for new users)
  private getInitialAvatarColorSync(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(this.AVATAR_SYNC_KEY) === 'true';
  }

  // Helper to determine initial theme: saved choice or system preference
  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved) {
      return saved === 'dark';
    }
    // Respect OS preference if user hasn't chosen yet
    return typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Dynamically set CSS custom property --nb-yellow to match user's avatar accent color
  public applyAvatarThemeColor(avatarUrl?: string | null, forcePreview: boolean = false): void {
    if (typeof document === 'undefined') return;

    // If disabled and not a forced temporary preview, keep default classic yellow
    if (!this.isAvatarColorEnabled && !forcePreview) {
      document.documentElement.style.removeProperty('--nb-yellow');
      return;
    }

    if (!avatarUrl) {
      document.documentElement.style.removeProperty('--nb-yellow');
      return;
    }

    const filename = avatarUrl.split('/').pop() || '';
    const color = this.AVATAR_COLORS[filename];

    if (color) {
      document.documentElement.style.setProperty('--nb-yellow', color);
    } else {
      document.documentElement.style.removeProperty('--nb-yellow');
    }
  }

  // Sets or removes data-theme attribute on root <html> tag
  private applyTheme(dark: boolean): void {
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }
}
