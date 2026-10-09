import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post, PostComment } from '../../models/post.models';
import { CurrentUser } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';

import { ReportModalComponent } from '../report-modal/report-modal.component';

export interface ContentSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

export interface DisplayPost extends Post {
  avatarColor: string;
  initials: string;
  relativeTime: string;
  segments: ContentSegment[];
}

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReportModalComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  private _posts: Post[] = [];
  displayPosts: DisplayPost[] = [];
  visiblePosts: DisplayPost[] = [];
  readonly pageSize = 6;
  visibleCount = 6;
  isLoadingMore = false;

  @Input()
  set posts(val: Post[]) {
    this._posts = val || [];
    this.processPosts();
  }
  get posts(): Post[] {
    return this._posts;
  }

  @Input() loading: boolean = false;
  @Input() emptyTitle: string = 'No posts in the stream yet';
  @Input() emptyMessage: string = 'Be the first developer to share a code snippet, question, or thought!';
  @Input() showAuthor: boolean = true;
  @Input() showCreateButton: boolean = true;

  @Output() postLiked = new EventEmitter<Post>();
  @Output() postCommentClicked = new EventEmitter<Post>();
  @Output() triggerCreate = new EventEmitter<void>();
  @Output() postUpdated = new EventEmitter<Post>();
  @Output() postDeleted = new EventEmitter<number>();

  currentUser: CurrentUser | null = null;
  private authSub?: Subscription;

  copiedPostId: number | null = null;
  copiedCodeIndex: string | null = null;

  likedPostIds = new Set<number>();

  // Comments state
  expandedCommentPostIds = new Set<number>();
  postComments = new Map<number, PostComment[]>();
  loadingComments = new Set<number>();
  commentInputs: { [postId: number]: string } = {};
  submittingComment = new Set<number>();
  deletingCommentId: number | null = null;
  commentError: { [postId: number]: string | null } = {};

  // Dropdown menu state
  activeDropdownPostId: number | null = null;

  // Edit Modal State
  editingPost: DisplayPost | null = null;
  editTitle: string = '';
  editTextContent: string = '';
  editSelectedFile: File | null = null;
  editFilePreview: string | null = null;
  editRemoveMedia: boolean = false;
  isSubmittingEdit: boolean = false;
  editErrorMessage: string | null = null;

  // Delete Modal State
  deletingPost: DisplayPost | null = null;
  isSubmittingDelete: boolean = false;
  deleteErrorMessage: string | null = null;

  // Report Modal State
  reportingPost: DisplayPost | null = null;
  reportFeedbackMessage: string | null = null;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authSub = this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  isOwner(post: Post): boolean {
    if (!this.currentUser) return false;
    return post.authorUsername === this.currentUser.username;
  }

  isOwnerOrAdmin(post: Post): boolean {
    if (!this.currentUser) return false;
    return post.authorUsername === this.currentUser.username || this.currentUser.role === 'ROLE_ADMIN';
  }

  private processPosts(): void {
    this.displayPosts = this._posts.map(post => {
      if (post.liked) {
        this.likedPostIds.add(post.id);
      } else {
        this.likedPostIds.delete(post.id);
      }
      return {
        ...post,
        avatarColor: this.getAvatarColor(post.authorUsername),
        initials: this.getInitials(post.authorUsername),
        relativeTime: this.getRelativeTime(post.createdAt),
        segments: this.parsePostSegments(post.textContent)
      };
    });
    this.visibleCount = Math.max(this.pageSize, Math.min(this.visibleCount, this.displayPosts.length || this.pageSize));
    this.updateVisiblePosts();
  }

  private updateVisiblePosts(): void {
    this.visiblePosts = this.displayPosts.slice(0, this.visibleCount);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isLoadingMore || this.visibleCount >= this.displayPosts.length) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 350;
    if (scrollPosition >= threshold) {
      this.loadMorePosts();
    }
  }

  loadMorePosts(): void {
    if (this.isLoadingMore || this.visibleCount >= this.displayPosts.length) return;
    this.isLoadingMore = true;
    setTimeout(() => {
      this.visibleCount = Math.min(this.visibleCount + this.pageSize, this.displayPosts.length);
      this.updateVisiblePosts();
      this.isLoadingMore = false;
      this.cdr.detectChanges();
    }, 200);
  }

  getRelativeTime(dateString?: string): string {
    if (!dateString) return 'Just now';

    let normalized = dateString;
    if (!normalized.endsWith('Z') && !normalized.includes('+')) {
      normalized = `${normalized}Z`;
    }

    const date = new Date(normalized);
    const now = new Date();
    let diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60 && diffInSeconds >= -60) {
      return 'Just now';
    }

    if (diffInSeconds < -60) {
      diffInSeconds = Math.abs(diffInSeconds);
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getAvatarColor(username: string): string {
    const colors = ['#ffdb58', '#2ec4b6', '#ff6b6b', '#a78bfa', '#38bdf8', '#fb923c'];
    if (!username) return colors[0];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getInitials(username: string): string {
    if (!username) return '??';
    return username.substring(0, Math.min(2, username.length)).toUpperCase();
  }

  getMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const clean = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:8080${clean}`;
  }

  isVideo(url?: string | null): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.mp4') || lower.endsWith('.webm');
  }

  parsePostSegments(text?: string | null): ContentSegment[] {
    if (!text) return [];
    const segments: ContentSegment[] = [];
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textChunk = text.substring(lastIndex, match.index).trim();
        if (textChunk) {
          segments.push({ type: 'text', content: textChunk });
        }
      }
      segments.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex).trim();
      if (remaining) {
        segments.push({ type: 'text', content: remaining });
      }
    }

    if (segments.length === 0 && text.trim()) {
      segments.push({ type: 'text', content: text.trim() });
    }

    return segments;
  }

  toggleLike(post: Post): void {
    const wasLiked = this.isLiked(post.id);
    const prevCount = post.likesCount ?? 0;

    // Optimistic local update for responsive UI
    if (wasLiked) {
      this.likedPostIds.delete(post.id);
      post.liked = false;
      post.likesCount = Math.max(0, prevCount - 1);
    } else {
      this.likedPostIds.add(post.id);
      post.liked = true;
      post.likesCount = prevCount + 1;
    }
    this.cdr.markForCheck();

    this.postService.toggleLike(post.id).subscribe({
      next: (res) => {
        post.likesCount = res.likesCount;
        post.liked = res.liked;
        if (res.liked) {
          this.likedPostIds.add(post.id);
        } else {
          this.likedPostIds.delete(post.id);
        }

        const originalPost = this._posts.find(p => p.id === post.id);
        if (originalPost) {
          originalPost.liked = res.liked;
          originalPost.likesCount = res.likesCount;
        }

        this.postLiked.emit(post);
        this.cdr.markForCheck();
      },
      error: (err) => {
        // Revert on failure
        if (wasLiked) {
          this.likedPostIds.add(post.id);
        } else {
          this.likedPostIds.delete(post.id);
        }
        post.liked = wasLiked;
        post.likesCount = prevCount;

        const originalPost = this._posts.find(p => p.id === post.id);
        if (originalPost) {
          originalPost.liked = wasLiked;
          originalPost.likesCount = prevCount;
        }

        this.cdr.markForCheck();
        console.error('Failed to toggle like on backend', err);
      }
    });
  }

  isLiked(postId: number): boolean {
    return this.likedPostIds.has(postId);
  }

  getLikesCount(post: Post): number {
    return post.likesCount ?? 0;
  }

  getCommentsCount(post: Post): number {
    return post.commentsCount ?? 0;
  }

  // --- COMMENTS MANAGEMENT ---

  toggleComments(post: Post): void {
    if (this.expandedCommentPostIds.has(post.id)) {
      this.expandedCommentPostIds.delete(post.id);
    } else {
      this.expandedCommentPostIds.add(post.id);
      if (!this.postComments.has(post.id)) {
        this.loadComments(post.id);
      }
    }
    this.postCommentClicked.emit(post);
    this.cdr.markForCheck();
  }

  onCommentClick(post: Post): void {
    this.toggleComments(post);
  }

  isCommentsExpanded(postId: number): boolean {
    return this.expandedCommentPostIds.has(postId);
  }

  loadComments(postId: number): void {
    this.loadingComments.add(postId);
    this.commentError[postId] = null;
    this.commentService.getComments(postId).subscribe({
      next: (comments) => {
        this.postComments.set(postId, comments);
        this.loadingComments.delete(postId);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loadingComments.delete(postId);
        this.commentError[postId] = 'Failed to load comments.';
        this.cdr.markForCheck();
      }
    });
  }

  getPostComments(postId: number): PostComment[] {
    return this.postComments.get(postId) || [];
  }

  isLoadingComments(postId: number): boolean {
    return this.loadingComments.has(postId);
  }

  isSubmittingComment(postId: number): boolean {
    return this.submittingComment.has(postId);
  }

  submitComment(post: Post): void {
    if (!this.currentUser) {
      alert('Please log in to comment.');
      return;
    }

    const text = (this.commentInputs[post.id] || '').trim();
    if (!text) return;

    this.submittingComment.add(post.id);
    this.commentError[post.id] = null;

    this.commentService.addComment(post.id, text).subscribe({
      next: (newComment) => {
        const list = this.postComments.get(post.id) || [];
        list.push(newComment);
        this.postComments.set(post.id, list);

        post.commentsCount = (post.commentsCount ?? 0) + 1;
        const original = this._posts.find(p => p.id === post.id);
        if (original) original.commentsCount = post.commentsCount;

        this.commentInputs[post.id] = '';
        this.submittingComment.delete(post.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submittingComment.delete(post.id);
        this.commentError[post.id] = err.error?.message || 'Failed to submit comment.';
        this.cdr.markForCheck();
      }
    });
  }

  deleteComment(post: Post, commentId: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    this.deletingCommentId = commentId;

    this.commentService.deleteComment(post.id, commentId).subscribe({
      next: () => {
        const list = this.postComments.get(post.id) || [];
        const updated = list.filter(c => c.id !== commentId);
        this.postComments.set(post.id, updated);

        post.commentsCount = Math.max(0, (post.commentsCount ?? 1) - 1);
        const original = this._posts.find(p => p.id === post.id);
        if (original) original.commentsCount = post.commentsCount;

        this.deletingCommentId = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.deletingCommentId = null;
        alert(err.error?.message || 'Failed to delete comment.');
        this.cdr.markForCheck();
      }
    });
  }

  onCommentKeydown(event: KeyboardEvent, post: Post): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.submitComment(post);
    }
  }

  canDeleteComment(comment: PostComment, post: Post): boolean {
    if (!this.currentUser) return false;
    return (
      comment.authorUsername === this.currentUser.username ||
      post.authorUsername === this.currentUser.username ||
      this.currentUser.role === 'ROLE_ADMIN'
    );
  }

  copyCode(code: string, id: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedCodeIndex = id;
      setTimeout(() => {
        this.copiedCodeIndex = null;
      }, 2000);
    });
  }

  onCreateClick(): void {
    this.triggerCreate.emit();
  }

  // --- DROPDOWN CONTROLS ---

  toggleDropdown(postId: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.activeDropdownPostId === postId) {
      this.activeDropdownPostId = null;
    } else {
      this.activeDropdownPostId = postId;
    }
  }

  closeDropdown(): void {
    this.activeDropdownPostId = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdown();
  }

  // --- EDIT POST MODAL CONTROLS ---

  openEditModal(post: DisplayPost, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.closeDropdown();
    this.editingPost = post;
    this.editTitle = post.title || '';
    this.editTextContent = post.textContent || '';
    this.editSelectedFile = null;
    this.editFilePreview = null;
    this.editRemoveMedia = false;
    this.editErrorMessage = null;
    this.isSubmittingEdit = false;
  }

  closeEditModal(): void {
    this.editingPost = null;
    this.editSelectedFile = null;
    this.editFilePreview = null;
    this.editErrorMessage = null;
    this.isSubmittingEdit = false;
  }

  onEditFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.editSelectedFile = input.files[0];
      this.editRemoveMedia = false;
      const reader = new FileReader();
      reader.onload = () => {
        this.editFilePreview = reader.result as string;
      };
      reader.readAsDataURL(this.editSelectedFile);
    }
  }

  markRemoveMedia(): void {
    this.editRemoveMedia = true;
    this.editSelectedFile = null;
    this.editFilePreview = null;
  }

  savePostEdit(): void {
    if (!this.editingPost) return;

    const trimmedTitle = this.editTitle.trim();
    if (!trimmedTitle) {
      this.editErrorMessage = 'Post title is required.';
      return;
    }

    const trimmedText = this.editTextContent.trim();
    const hasExistingMedia = this.editingPost.mediaUrl && !this.editRemoveMedia;
    const hasNewMedia = !!this.editSelectedFile;

    if (!trimmedText && !hasExistingMedia && !hasNewMedia) {
      this.editErrorMessage = 'Post must contain either text content or an attachment.';
      return;
    }

    this.isSubmittingEdit = true;
    this.editErrorMessage = null;

    this.postService.updatePost(
      this.editingPost.id,
      trimmedTitle,
      trimmedText,
      this.editSelectedFile || undefined,
      this.editRemoveMedia
    ).subscribe({
      next: (updatedPost) => {
        this.isSubmittingEdit = false;
        const idx = this._posts.findIndex(p => p.id === updatedPost.id);
        if (idx !== -1) {
          this._posts[idx] = updatedPost;
        }
        this.processPosts();
        this.postUpdated.emit(updatedPost);
        this.closeEditModal();
      },
      error: (err) => {
        this.isSubmittingEdit = false;
        this.editErrorMessage = err.error?.message || 'Failed to update post. Please try again.';
      }
    });
  }

  // --- DELETE POST MODAL CONTROLS ---

  openDeleteModal(post: DisplayPost, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.closeDropdown();
    this.deletingPost = post;
    this.isSubmittingDelete = false;
    this.deleteErrorMessage = null;
  }

  closeDeleteModal(): void {
    this.deletingPost = null;
    this.deleteErrorMessage = null;
    this.isSubmittingDelete = false;
  }

  confirmDelete(): void {
    if (!this.deletingPost) return;

    const idToDelete = this.deletingPost.id;
    this.isSubmittingDelete = true;
    this.deleteErrorMessage = null;

    this.postService.deletePost(idToDelete).subscribe({
      next: () => {
        this.isSubmittingDelete = false;
        this._posts = this._posts.filter(p => p.id !== idToDelete);
        this.processPosts();
        this.postDeleted.emit(idToDelete);
        this.closeDeleteModal();
      },
      error: (err) => {
        this.isSubmittingDelete = false;
        this.deleteErrorMessage = err.error?.message || 'Failed to delete post. Please try again.';
      }
    });
  }

  // --- REPORT MODAL CONTROLS ---

  openReportModal(post: DisplayPost, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.closeDropdown();
    this.reportingPost = post;
  }

  closeReportModal(): void {
    this.reportingPost = null;
  }

  onReportSubmitted(): void {
    this.reportFeedbackMessage = 'Moderation report submitted to administrators.';
    setTimeout(() => {
      this.reportFeedbackMessage = null;
      this.cdr.detectChanges();
    }, 4000);
    this.cdr.detectChanges();
  }
}
