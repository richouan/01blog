import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Banned Account Modal Popout
  isBannedModalOpen = false;
  bannedReason = '';

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Detect if redirected here due to an active ban
    this.route.queryParams.subscribe(params => {
      if (params['banned'] === 'true') {
        this.isBannedModalOpen = true;
        this.bannedReason = 'Your account has been suspended or banned by an administrator due to violations of platform guidelines.';
        this.errorMessage = 'Account suspended: access denied by platform administration.';
        this.cdr.detectChanges();
      }
    });
  }

  closeBannedModal(): void {
    this.isBannedModalOpen = false;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate inputs
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Welcome back, @${response.username}! Redirecting...`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 900);
      },
      error: (err) => {
        this.isLoading = false;

        const isBannedError = err.status === 403 ||
          err.error?.error === 'ACCOUNT_BANNED' ||
          (typeof err.error?.message === 'string' && err.error.message.toLowerCase().includes('banned')) ||
          (typeof err.error?.message === 'string' && err.error.message.toLowerCase().includes('suspended'));

        if (isBannedError) {
          this.isBannedModalOpen = true;
          this.bannedReason = err.error?.message || 'This account has been suspended or banned by an administrator.';
          this.errorMessage = 'Account suspended: access denied by platform administration.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to backend server. Make sure it is running on port 8080.';
        } else {
          this.errorMessage = err.error?.message || 'Invalid username or password.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}

