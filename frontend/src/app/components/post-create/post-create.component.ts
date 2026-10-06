import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  textContent: string = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  fileName: string = '';
  fileSizeFormatted: string = '';

  isExpanded: boolean = false;
  isDragging: boolean = false;
  isSubmitting: boolean = false;
  showCodeSnippet: boolean = false;
  codeLanguage: string = 'java';
  codeSnippet: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private postService: PostService) {}

  popularTags: string[] = ['#zone01', '#java', '#angular', '#algo', '#snippet', '#help'];

  // Handle image file selection via file picker
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
    input.value = ''; // Reset input so same file can be re-selected if deleted
  }

  // Validate and generate data URL preview
  processFile(file: File): void {
    this.errorMessage = '';

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file (PNG, JPG, WEBP, GIF).';
      return;
    }

    // 10MB file size limit
    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage = 'Image size exceeds the 10MB limit.';
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.isExpanded = true;
    };
    reader.readAsDataURL(file);
  }

  // Remove selected image
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileName = '';
    this.fileSizeFormatted = '';
  }

  // Drag and drop handlers
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

  // Toggle code snippet builder
  toggleCodeSnippet(): void {
    this.showCodeSnippet = !this.showCodeSnippet;
    if (this.showCodeSnippet) {
      this.isExpanded = true;
    }
  }

  // Insert formatted code block into post body
  insertCodeBlock(): void {
    if (!this.codeSnippet.trim()) return;

    const block = `\n\`\`\`${this.codeLanguage}\n${this.codeSnippet.trim()}\n\`\`\`\n`;
    this.textContent = (this.textContent + block).trim();
    this.codeSnippet = '';
    this.showCodeSnippet = false;
  }

  // Append clicked hashtag
  addTag(tag: string): void {
    if (!this.textContent.includes(tag)) {
      this.textContent = this.textContent ? `${this.textContent.trim()} ${tag}` : tag;
      this.isExpanded = true;
    }
  }

  get canPost(): boolean {
    return this.textContent.trim().length > 0 || this.selectedFile !== null;
  }

  // Video button click handler
  onVideoClick(): void {
    this.isExpanded = true;
    if (!this.textContent.includes('🎥')) {
      this.textContent = (this.textContent + ' 🎥 [Video: paste URL here]').trim();
    }
  }

  // External trigger to focus post creation from sidebar CTA
  focusInput(): void {
    this.isExpanded = true;
    const el = document.querySelector('.post-textarea') as HTMLTextAreaElement;
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onSubmit(): void {
    if (!this.canPost || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const textToSend = this.textContent.trim() || undefined;
    const fileToSend = this.selectedFile || undefined;

    this.postService.createPost(textToSend, fileToSend).subscribe({
      next: (createdPost) => {
        this.isSubmitting = false;
        this.successMessage = 'Post published successfully!';
        this.postCreated.emit(createdPost);

        // Reset form after submission
        this.textContent = '';
        this.removeImage();
        this.codeSnippet = '';
        this.showCodeSnippet = false;
        this.isExpanded = false;

        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to publish post. Please try again.';
      }
    });
  }
}
