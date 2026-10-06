import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.models';

export interface ContentSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

export interface DisplayPost extends Post {
  avatarColor: string;
  initials: string;
  relativeTime: string;
  tags: string[];
  segments: ContentSegment[];
  title?: string | null;
}

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  private _posts: Post[] = [];
  displayPosts: DisplayPost[] = [];

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

  @Output() postLiked = new EventEmitter<Post>();
  @Output() postCommentClicked = new EventEmitter<Post>();
  @Output() triggerCreate = new EventEmitter<void>();

  copiedPostId: number | null = null;
  copiedCodeIndex: string | null = null;

  // Local like & bookmark state for immediate tactile feedback
  likedPostIds = new Set<number>();
  bookmarkedPostIds = new Set<number>();

  // Process posts into pre-computed display objects once to avoid change detection loops
  private processPosts(): void {
    this.displayPosts = this._posts.map(post => {
      const extracted = this.extractTitleAndBody(post.textContent);
      return {
        ...post,
        title: extracted.title,
        avatarColor: this.getAvatarColor(post.authorUsername),
        initials: this.getInitials(post.authorUsername),
        relativeTime: this.getRelativeTime(post.createdAt),
        tags: this.extractTags(post.textContent),
        segments: this.parsePostSegments(extracted.body || post.textContent)
      };
    });
  }

  // Format relative timestamp in human-readable terms
  getRelativeTime(dateString?: string): string {
    if (!dateString) return 'Just now';

    // Normalize ISO date: treat as UTC if no offset specified
    let normalized = dateString;
    if (!normalized.endsWith('Z') && !normalized.includes('+')) {
      normalized = `${normalized}Z`;
    }

    const date = new Date(normalized);
    const now = new Date();
    let diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // If posted within the last 60 seconds (or small client/server clock skew)
    if (diffInSeconds < 60 && diffInSeconds >= -60) {
      return 'Just now';
    }

    // Handle clock skew where server was ahead
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

  // Consistent deterministic avatar color from username
  getAvatarColor(username: string): string {
    const colors = ['#ffdb58', '#2ec4b6', '#ff6b6b', '#a78bfa', '#38bdf8', '#fb923c'];
    if (!username) return colors[0];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  // Two initials for user avatar badge
  getInitials(username: string): string {
    if (!username) return '??';
    return username.substring(0, Math.min(2, username.length)).toUpperCase();
  }

  // Safe media URL resolver targeting backend static upload handler
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

  // Parse text into regular text and markdown-style code blocks
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

    // Fallback if no code blocks found
    if (segments.length === 0 && text.trim()) {
      segments.push({ type: 'text', content: text.trim() });
    }

    return segments;
  }

  // Extract title and body if user wrote a markdown header, newline separation, or first sentence
  extractTitleAndBody(text?: string | null): { title: string; body: string } {
    if (!text || !text.trim()) {
      return { title: 'Dev Log Update', body: '' };
    }
    const trimmed = text.trim();

    // 1. Explicit markdown header: # My Title
    if (trimmed.startsWith('# ')) {
      const nl = trimmed.indexOf('\n');
      if (nl > -1) {
        return {
          title: trimmed.substring(2, nl).trim(),
          body: trimmed.substring(nl + 1).trim()
        };
      }
      return { title: trimmed.substring(2).trim(), body: '' };
    }

    // 2. Any newline (single or double) within first 90 characters
    const nl = trimmed.indexOf('\n');
    if (nl > 0 && nl <= 90) {
      const firstLine = trimmed.substring(0, nl).trim();
      if (!firstLine.startsWith('```')) {
        return {
          title: firstLine,
          body: trimmed.substring(nl + 1).trim()
        };
      }
    }

    // 3. First sentence ending with punctuation within first 80 chars
    const sentenceEnd = trimmed.search(/[.!?](\s|$)/);
    if (sentenceEnd > 0 && sentenceEnd <= 80) {
      return {
        title: trimmed.substring(0, sentenceEnd).trim(),
        body: trimmed.substring(sentenceEnd + 1).trim()
      };
    }

    // 4. Short post text (<= 60 chars) acts directly as the title
    if (trimmed.length <= 60 && !trimmed.startsWith('```')) {
      return {
        title: trimmed,
        body: ''
      };
    }

    // 5. Fallback for longer unformatted text: prominent excerpt header
    if (!trimmed.startsWith('```')) {
      const spaceIdx = trimmed.lastIndexOf(' ', 50);
      const cut = spaceIdx > 20 ? spaceIdx : 50;
      return {
        title: trimmed.substring(0, cut).trim() + '...',
        body: trimmed
      };
    }

    return { title: 'Code Snippet', body: trimmed };
  }

  // Extract hashtags from post content
  extractTags(text?: string | null): string[] {
    if (!text) return [];
    const matches = text.match(/#[a-zA-Z0-9_-]+/g);
    return matches ? Array.from(new Set(matches)).slice(0, 4) : [];
  }

  toggleLike(post: Post): void {
    if (this.likedPostIds.has(post.id)) {
      this.likedPostIds.delete(post.id);
    } else {
      this.likedPostIds.add(post.id);
    }
    this.postLiked.emit(post);
  }

  isLiked(postId: number): boolean {
    return this.likedPostIds.has(postId);
  }

  toggleBookmark(post: Post): void {
    if (this.bookmarkedPostIds.has(post.id)) {
      this.bookmarkedPostIds.delete(post.id);
    } else {
      this.bookmarkedPostIds.add(post.id);
    }
  }

  isBookmarked(postId: number): boolean {
    return this.bookmarkedPostIds.has(postId);
  }

  getLikesCount(post: Post): number {
    const base = ((post.id * 17) % 35) + 8;
    return this.likedPostIds.has(post.id) ? base + 1 : base;
  }

  getCommentsCount(post: Post): number {
    return ((post.id * 7) % 12) + 2;
  }

  onCommentClick(post: Post): void {
    this.postCommentClicked.emit(post);
  }

  copyPostLink(post: Post): void {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedPostId = post.id;
      setTimeout(() => {
        this.copiedPostId = null;
      }, 2000);
    });
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
}
