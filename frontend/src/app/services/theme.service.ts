import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  // Holds whether dark mode is currently active
  private isDarkSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    // Apply saved theme immediately upon initialization
    this.applyTheme(this.isDarkSubject.value);
  }

  // Synchronous getter for current mode
  public get isDarkMode(): boolean {
    return this.isDarkSubject.value;
  }

  // Toggle between light and dark
  public toggleTheme(): void {
    const nextState = !this.isDarkSubject.value;
    this.isDarkSubject.next(nextState);
    this.applyTheme(nextState);
    localStorage.setItem(this.THEME_KEY, nextState ? 'dark' : 'light');
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
