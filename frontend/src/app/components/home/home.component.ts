import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CurrentUser, UserProfile } from '../../models/auth.models';
import { Post } from '../../models/post.models';
import { PostCreateComponent } from '../post-create/post-create.component';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PostCreateComponent, PostListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(PostCreateComponent) postCreateComponent?: PostCreateComponent;

  currentUser: CurrentUser | null = null;
  userProfile: UserProfile | null = null;

  posts: Post[] = [];
  isLoadingPosts: boolean = true;
  activeFeedTab: 'following' | 'latest' = 'following';

  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private cdr: ChangeDetectorRef
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
    this.loadPosts();
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

  loadPosts(): void {
    this.isLoadingPosts = true;
    const request$ = this.activeFeedTab === 'following'
      ? this.postService.getFeedPosts()
      : this.postService.getAllPosts();

    this.sub.add(
      request$.subscribe({
        next: (fetchedPosts) => {
          this.posts = fetchedPosts;
          this.isLoadingPosts = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Could not load stream posts', err);
          this.isLoadingPosts = false;
          this.cdr.markForCheck();
        }
      })
    );
  }

  // Triggered by sidebar "Create post +" CTA button
  // Visual feedback confirmation banner for post creation
  postFeedbackMessage: { title: string; subtitle: string } | null = null;
  private postFeedbackTimer: any = null;

  triggerCreatePost(): void {
    if (this.postCreateComponent) {
      this.postCreateComponent.focusInput();
    }
  }

  // Handle post emission from PostCreateComponent
  onPostCreated(createdPost: Post): void {
    // Prepend newly created post with new array reference
    this.posts = [createdPost, ...this.posts];
    this.isLoadingPosts = false;
    this.postFeedbackMessage = {
      title: 'Post Published Successfully!',
      subtitle: createdPost.title ? `"${createdPost.title}" is now live on the feed.` : 'Your publication is now live on the feed.'
    };
    this.cdr.markForCheck();

    if (this.postFeedbackTimer) {
      clearTimeout(this.postFeedbackTimer);
    }
    this.postFeedbackTimer = setTimeout(() => {
      this.postFeedbackMessage = null;
      this.cdr.markForCheck();
    }, 4500);
  }

  onPostDeleted(deletedId: number): void {
    this.posts = this.posts.filter(p => p.id !== deletedId);
    this.cdr.markForCheck();
  }

  onPostUpdated(updatedPost: Post): void {
    const idx = this.posts.findIndex(p => p.id === updatedPost.id);
    if (idx !== -1) {
      const copy = [...this.posts];
      copy[idx] = updatedPost;
      this.posts = copy;
      this.cdr.markForCheck();
    }
  }

  setFeedTab(tab: 'following' | 'latest'): void {
    this.activeFeedTab = tab;
    this.loadPosts();
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
