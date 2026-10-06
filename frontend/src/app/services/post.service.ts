import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.models';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  // Create a new post with multipart/form-data
  createPost(textContent?: string, file?: File): Observable<Post> {
    const formData = new FormData();
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

  // Get feed (posts from followed students + self)
  getFeedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/feed`);
  }
}
