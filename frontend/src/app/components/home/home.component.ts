import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CurrentUser, UserProfile } from '../../models/auth.models';
import { Post } from '../../models/post.models';
import { PostCreateComponent } from '../post-create/post-create.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PostCreateComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(PostCreateComponent) postCreateComponent?: PostCreateComponent;

  currentUser: CurrentUser | null = null;
  userProfile: UserProfile | null = null;

  activeFeedTab: 'for-you' | 'following' | 'latest' = 'for-you';

  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadCurrentUserProfile();
        }
      })
    );
  }

  loadCurrentUserProfile(): void {
    this.sub.add(
      this.userService.getCurrentUser().subscribe({
        next: (profile) => {
          this.userProfile = profile;
        },
        error: (err) => console.error('Could not load current user profile', err)
      })
    );
  }

  // Triggered by sidebar "Create post +" CTA button
  triggerCreatePost(): void {
    if (this.postCreateComponent) {
      this.postCreateComponent.focusInput();
    }
  }

  // Handle post emission from PostCreateComponent
  onPostCreated(createdPost: Post): void {
    console.log('Post published successfully:', createdPost);
  }

  setFeedTab(tab: 'for-you' | 'following' | 'latest'): void {
    this.activeFeedTab = tab;
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
