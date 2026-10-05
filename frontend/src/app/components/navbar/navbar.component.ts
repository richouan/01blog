import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CurrentUser } from '../../models/auth.models';

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
  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Listen to user authentication changes
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.cdr.detectChanges();
      })
    );

    // Listen to route changes
    this.sub.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          this.isUserDropdownOpen = false;
          this.cdr.detectChanges();
        })
    );
  }

  // Focus search input on Ctrl+K / Cmd+K
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const input = document.getElementById('navSearchInput') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-wrapper')) {
      this.isUserDropdownOpen = false;
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
  }

  isAuthPage(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }

  onLogout(): void {
    this.isUserDropdownOpen = false;
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

