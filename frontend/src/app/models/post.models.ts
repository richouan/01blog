export interface Post {
  id: number;
  title: string;
  textContent?: string | null;
  mediaUrl?: string | null;
  authorId: number;
  authorUsername: string;
  authorAvatarUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  likesCount?: number;
  liked?: boolean;
  commentsCount?: number;
  hidden?: boolean;
}

export interface LikeResponse {
  postId: number;
  liked: boolean;
  likesCount: number;
}

export interface PostComment {
  id: number;
  postId: number;
  authorId: number;
  authorUsername: string;
  authorAvatarUrl?: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
}
