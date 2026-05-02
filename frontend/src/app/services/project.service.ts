import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/projects`;

  getProjects(status?: string): Observable<Project[]> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.http.get<Project[]>(this.url, { params });
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.url, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.url}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
