import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'archives',
    loadComponent: () => import('./pages/archives/archives.component').then(m => m.ArchivesComponent)
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./pages/post-editor/post-editor.component').then(m => m.PostEditorComponent)
  },
  {
    path: 'posts/:id/edit',
    loadComponent: () => import('./pages/post-editor/post-editor.component').then(m => m.PostEditorComponent)
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent)
  },
  {
    path: 'books',
    loadComponent: () => import('./pages/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'report',
    loadComponent: () => import('./pages/report/report.component').then(m => m.ReportComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
