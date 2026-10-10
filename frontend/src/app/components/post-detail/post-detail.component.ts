import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.models';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PostListComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = true;
  errorMessage = '';
  postId: number | null = null;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          const parsed = Number(idParam);
          if (isNaN(parsed) || parsed <= 0) {
            this.errorMessage = 'Post not found.';
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }
          this.postId = parsed;
          this.loadPost(this.postId);
        }
      })
    );
  }

  loadPost(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.posts = [];
    this.cdr.detectChanges();

    this.sub.add(
      this.postService.getPostById(id).subscribe({
        next: (post) => {
          this.posts = [post];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 404) {
            this.errorMessage = err.error?.message || 'Post not found. It may have been deleted.';
          } else if (err.status === 403) {
            this.errorMessage = err.error?.message || 'This post is private or unavailable.';
          } else {
            this.errorMessage = err.error?.message || 'Could not load this post. Please try again.';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  goBack(): void {
    this.location.back();
  }

  onPostDeleted(): void {
    this.posts = [];
    this.errorMessage = 'This post has been deleted.';
    this.cdr.detectChanges();
  }

  onPostUpdated(updatedPost: Post): void {
    this.posts = [updatedPost];
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
