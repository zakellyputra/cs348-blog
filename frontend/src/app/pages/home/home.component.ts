import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Post } from '../../models/models';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <h1>Recent posts</h1>
    <ul class="post-list">
      @for (post of posts; track post.postId) {
        <li>
          <a [routerLink]="['/posts', post.postId]">{{ post.title }}</a>
          <div class="muted">{{ post.createdAt | date:'longDate' }}</div>
        </li>
      }
    </ul>
    @if (posts.length > 0) {
      <p><a routerLink="/archives">View all posts</a></p>
    }
    @if (posts.length === 0) {
      <p class="muted">No posts yet. <a routerLink="/posts/new">Write one.</a></p>
    }
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private postService = inject(PostService);
  private cdr = inject(ChangeDetectorRef);
  posts: Post[] = [];

  ngOnInit() {
    this.postService.getPosts('recent').subscribe(posts => {
      this.posts = posts.slice(0, 8);
      this.cdr.markForCheck();
    });
  }
}
