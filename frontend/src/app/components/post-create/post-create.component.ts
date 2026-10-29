import { Component, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentUser } from '../../models/auth.models';
import { Post } from '../../models/post.models';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  @Input() currentUser: CurrentUser | null = null;
  @Output() postCreated = new EventEmitter<Post>();

  title: string = '';
  textContent: string = '';
  selectedFile: File | null = null;
  mediaPreview: string | null = null;
  isMediaVideo: boolean = false;
  fileName: string = '';
  fileSizeFormatted: string = '';

  isExpanded: boolean = false;
  isDragging: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private postService: PostService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  expandForm(): void {
    this.isExpanded = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      const el = document.querySelector('.post-title-input') as HTMLInputElement;
      if (el) {
        el.focus();
      }
    }, 50);
  }

  focusInput(): void {
    this.expandForm();
    setTimeout(() => {
      const card = document.querySelector('.create-post-card') as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  }

  cancelCreate(): void {
    this.title = '';
    this.textContent = '';
    this.removeMedia();
    this.isExpanded = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  getMediaUrl(url?: string | null): string {
    if (!url) return '';
    const clean = url.startsWith('/') ? url : `/${url}`;
    if (!clean.startsWith('/uploads/')) return '';
    return `http://localhost:8080${clean}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
    input.value = '';
  }

  processFile(file: File): void {
    this.errorMessage = '';

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');

    if (!isImage && !isVideo) {
      this.errorMessage = 'Please select a valid image (PNG, JPG, WEBP, GIF) or video (MP4, WEBM).';
      this.cdr.detectChanges();
      return;
    }

    // Limit check: 30MB
    if (file.size > 30 * 1024 * 1024) {
      this.errorMessage = 'Media file size exceeds the 30MB limit.';
      this.cdr.detectChanges();
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.isMediaVideo = isVideo;
    this.fileSizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    // Immediately expand form to show preview
    this.isExpanded = true;

    // Instant zero-latency synchronous preview via object URL
    try {
      if (this.mediaPreview && this.mediaPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.mediaPreview);
      }
      this.mediaPreview = URL.createObjectURL(file);
      this.cdr.detectChanges();
    } catch {
      // Fallback
    }

    // Secondary FileReader to guarantee data URI stability
    const reader = new FileReader();
    reader.onload = () => {
      this.ngZone.run(() => {
        this.mediaPreview = reader.result as string;
        this.isExpanded = true;
        this.cdr.detectChanges();
      });
    };
    reader.readAsDataURL(file);
  }

  removeMedia(): void {
    if (this.mediaPreview && this.mediaPreview.startsWith('blob:')) {
      URL.revokeObjectURL(this.mediaPreview);
    }
    this.selectedFile = null;
    this.mediaPreview = null;
    this.isMediaVideo = false;
    this.fileName = '';
    this.fileSizeFormatted = '';
    this.cdr.detectChanges();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  get canPost(): boolean {
    const hasTitle = this.title.trim().length > 0;
    const hasContentOrMedia = this.textContent.trim().length > 0 || this.selectedFile !== null;
    return hasTitle && hasContentOrMedia;
  }

  onSubmit(): void {
    if (!this.canPost || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const titleToSend = this.title.trim();
    const textToSend = this.textContent.trim() || undefined;
    const fileToSend = this.selectedFile || undefined;

    this.postService.createPost(titleToSend, textToSend, fileToSend).subscribe({
      next: (createdPost) => {
        this.isSubmitting = false;
        this.postCreated.emit(createdPost);

        // Reset form after submission
        this.title = '';
        this.textContent = '';
        this.removeMedia();
        this.isExpanded = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to publish post. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
