import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentPayload } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/posts/${postId}/comments`);
  }

  addComment(postId: number, payload: CreateCommentPayload): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/posts/${postId}/comments`, payload);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${id}`);
  }
}
