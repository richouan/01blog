import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CurrentUser } from '../../models/auth.models';

// UserProfileComponent displays the student's personal Block page
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  activeTab: 'posts' | 'about' = 'posts';
  copiedLink = false;
  private sub = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Listen to current logged-in user state
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  // Switch between Posts and About tabs
  setActiveTab(tab: 'posts' | 'about'): void {
    this.activeTab = tab;
  }

  // Quick action to copy profile link to clipboard
  copyProfileLink(): void {
    navigator.clipboard.writeText(window.location.href);
    this.copiedLink = true;
    setTimeout(() => {
      this.copiedLink = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
