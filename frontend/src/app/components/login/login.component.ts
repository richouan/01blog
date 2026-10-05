import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

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
        if (err.status === 0) {
          this.errorMessage = 'Cannot connect to backend server. Make sure it is running on port 8080.';
        } else {
          this.errorMessage = err.error?.message || 'Invalid username or password.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}

