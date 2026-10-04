import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.username.trim() || !this.email.trim() || !this.password) {
      this.errorMessage = 'All parameters are required to execute registration.';
      return;
    }

    // Validate password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    // Validate password confirmation
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password confirmation does not match.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Account initialized for user '${response.username}' [ROLE_USER]. Redirecting...`;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Server error occurred during registration.';
      }
    });
  }
}
