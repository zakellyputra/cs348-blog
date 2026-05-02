import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/books`;

  getBooks(status?: string): Observable<Book[]> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.http.get<Book[]>(this.url, { params });
  }

  createBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(this.url, book);
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.url}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
