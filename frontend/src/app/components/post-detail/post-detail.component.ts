import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    private router: Router,
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
            this.router.navigate(['/404'], { replaceUrl: true });
            return;
          }
          this.postId = parsed;
          this.loadPost(this.postId);
        } else {
          this.router.navigate(['/404'], { replaceUrl: true });
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
            this.router.navigate(['/404'], { replaceUrl: true });
            return;
          } else if (err.status === 403) {
            this.errorMessage = err.error?.message || 'This post is private or unavailable.';
            this.isLoading = false;
            this.cdr.detectChanges();
          } else {
            this.errorMessage = err.error?.message || 'Could not load this post. Please try again.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
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
