// Data models for moderation reports (User & Post)
export type ReportTargetType = 'USER' | 'POST';

export interface ReportRequest {
  targetType: ReportTargetType;
  targetUserId?: number;
  targetPostId?: number;
  reason: string;
}

export interface ReportResponse {
  id: number;
  reporterUsername: string;
  targetType: ReportTargetType;
  reportedUserId?: number;
  reportedUsername?: string;
  reportedPostId?: number;
  reportedPostTitle?: string;
  reason: string;
  createdAt: string;
}
