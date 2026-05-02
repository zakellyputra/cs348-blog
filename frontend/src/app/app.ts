import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="content">
      <header>
        <a class="site-title" routerLink="/">zach's blog</a>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/archives" routerLinkActive="active">Archives</a>
          <a routerLink="/books" routerLinkActive="active">Books</a>
          <a routerLink="/projects" routerLinkActive="active">Projects</a>
        </nav>
      </header>

      <router-outlet />

      <footer>
        <a routerLink="/about">About</a>
        <a routerLink="/archives">Archives</a>
        <a routerLink="/report">Report</a>
      </footer>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {}
