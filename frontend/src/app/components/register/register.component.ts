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

//------ just for ui feedback ------
  isPasswordTouched(): boolean {
    return this.password.length > 0;
  }

  isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  isConfirmPasswordTouched(): boolean {
    return this.confirmPassword.length > 0;
  }

  isConfirmPasswordValid(): boolean {
    return this.confirmPassword.length > 0 && this.confirmPassword === this.password && this.isPasswordValid();
  }
// ----------------


  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.username.trim() || !this.email.trim() || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    // Validate username format and length
    const trimmedUsername = this.username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      this.errorMessage = 'Username must be between 3 and 30 characters.';
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedUsername)) {
      this.errorMessage = 'Username can only contain letters, numbers, dots, underscores, and dashes.';
      return;
    }

    // Validate email regex format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address (e.g. richouan@zone01.ma).';
      return;
    }

    // Validate password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    // Validate password confirmation
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
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
