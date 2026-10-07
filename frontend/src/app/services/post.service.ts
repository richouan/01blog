import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, LikeResponse } from '../models/post.models';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  createPost(title: string, textContent?: string, file?: File): Observable<Post> {
    const formData = new FormData();
    formData.append('title', title.trim());
    if (textContent && textContent.trim()) {
      formData.append('textContent', textContent.trim());
    }
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Post>(this.apiUrl, formData);
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getUserPosts(username: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${username}`);
  }

  getFeedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/feed`);
  }

  toggleLike(postId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.apiUrl}/${postId}/like`, {});
  }

  getLikeStatus(postId: number): Observable<LikeResponse> {
    return this.http.get<LikeResponse>(`${this.apiUrl}/${postId}/like`);
  }

  updatePost(id: number, title?: string, textContent?: string, file?: File, removeMedia: boolean = false): Observable<Post> {
    const formData = new FormData();
    if (title !== undefined && title !== null) {
      formData.append('title', title.trim());
    }
    if (textContent !== undefined && textContent !== null) {
      formData.append('textContent', textContent.trim());
    }
    if (file) {
      formData.append('file', file);
    }
    formData.append('removeMedia', String(removeMedia));
    return this.http.put<Post>(`${this.apiUrl}/${id}`, formData);
  }

  deletePost(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`);
  }
}
