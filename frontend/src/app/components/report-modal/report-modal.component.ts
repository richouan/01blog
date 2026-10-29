import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ReportRequest, ReportResponse, ReportTargetType } from '../../models/report.models';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css'
})
export class ReportModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() targetType: ReportTargetType = 'POST';
  @Input() targetId: number | null = null;
  @Input() targetName = '';

  @Output() closed = new EventEmitter<void>();
  @Output() reportSubmitted = new EventEmitter<ReportResponse>();

  // Modal steps: 'form' -> 'confirm' -> 'success'
  step: 'form' | 'confirm' | 'success' = 'form';

  // Preset reason options
  readonly presetOptions: string[] = [
    'Spam or unsolicited advertising',
    'Harassment, hate speech, or abuse',
    'Inappropriate media or NSFW content',
    'Plagiarism or unauthorized copy',
    'Misleading information or title',
    'Other platform violation'
  ];

  selectedPreset = '';
  customDetails = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetModal();
    }
  }

  // Quick preset selector
  selectPreset(preset: string): void {
    if (this.selectedPreset === preset) {
      this.selectedPreset = '';
    } else {
      this.selectedPreset = preset;
    }
    this.errorMessage = '';
  }

  // Formatted combined reason
  get fullReason(): string {
    const parts: string[] = [];
    if (this.selectedPreset) {
      parts.push(this.selectedPreset);
    }
    if (this.customDetails.trim()) {
      parts.push(this.customDetails.trim());
    }
    return parts.join(' - ');
  }

  // Advance to confirmation step
  proceedToConfirmation(): void {
    const reason = this.fullReason;
    if (!reason || reason.trim().length < 5) {
      this.errorMessage = 'Please select a reason or provide at least 5 characters of explanation.';
      return;
    }
    if (this.customDetails.length > 1000) {
      this.errorMessage = 'Additional details cannot exceed 1000 characters.';
      return;
    }
    if (reason.length > 2000) {
      this.errorMessage = 'Report reason cannot exceed 2000 characters.';
      return;
    }
    this.errorMessage = '';
    this.step = 'confirm';
  }

  // Return from confirmation back to form
  backToForm(): void {
    this.step = 'form';
    this.errorMessage = '';
  }

  // Perform backend report submission
  confirmAndSubmit(): void {
    if (!this.targetId) {
      this.errorMessage = 'Missing target identifier.';
      return;
    }

    const request: ReportRequest = {
      targetType: this.targetType,
      targetUserId: this.targetType === 'USER' ? this.targetId : undefined,
      targetPostId: this.targetType === 'POST' ? this.targetId : undefined,
      reason: this.fullReason
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.reportService.submitReport(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.step = 'success';
        this.reportSubmitted.emit(response);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 0) {
          this.errorMessage = 'Unable to reach backend server. Please try again.';
        } else if (err.error && typeof err.error.message === 'string') {
          this.errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Failed to submit report. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Close modal and emit event
  close(): void {
    if (this.isSubmitting) return;
    this.resetModal();
    this.closed.emit();
  }

  // Reset internal states
  private resetModal(): void {
    this.step = 'form';
    this.selectedPreset = '';
    this.customDetails = '';
    this.isSubmitting = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
}
