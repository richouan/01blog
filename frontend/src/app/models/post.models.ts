export interface Post {
  id: number;
  title: string;
  textContent?: string | null;
  mediaUrl?: string | null;
  authorId: number;
  authorUsername: string;
  createdAt: string;
  updatedAt?: string | null;
}
