import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, CreatePostPayload, UpdatePostPayload } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/posts`;

  getPosts(sort: string = 'recent'): Observable<Post[]> {
    return this.http.get<Post[]>(this.url, { params: { sort } });
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.url}/${id}`);
  }

  createPost(payload: CreatePostPayload): Observable<Post> {
    return this.http.post<Post>(this.url, payload);
  }

  updatePost(id: number, payload: UpdatePostPayload): Observable<Post> {
    return this.http.put<Post>(`${this.url}/${id}`, payload);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
