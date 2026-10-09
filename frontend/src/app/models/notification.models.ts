// Model definition for student notifications
export interface NotificationItem {
  id: number;
  type: 'NEW_POST' | 'NEW_FOLLOWER' | 'FOLLOW_REQUEST' | 'FOLLOW_ACCEPTED';
  message: string;
  actorUsername: string;
  actorAvatarUrl?: string | null;
  referenceId?: number;
  isRead: boolean;
  read?: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
