// Model definition for student notifications
export interface NotificationItem {
  id: number;
  type: 'NEW_POST' | 'NEW_FOLLOWER';
  message: string;
  actorUsername: string;
  referenceId?: number;
  isRead: boolean;
  read?: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
