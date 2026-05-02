import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/tags`;

  getTags(type: string = 'all'): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.url, { params: { type } });
  }

  createTag(name: string): Observable<Tag> {
    return this.http.post<Tag>(this.url, { tagName: name });
  }
}
