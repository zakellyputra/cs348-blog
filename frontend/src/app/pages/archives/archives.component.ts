import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Post, Tag } from '../../models/models';
import { PostService } from '../../services/post.service';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <h1>Archives</h1>

    <div class="sort-controls">
      Sort:
      <a (click)="setSort('recent')" [class.active]="currentSort === 'recent'">most recent</a>
      <a (click)="setSort('oldest')" [class.active]="currentSort === 'oldest'">oldest</a>
      <a (click)="setSort('views')" [class.active]="currentSort === 'views'">most viewed</a>
    </div>

    <div class="tag-list">
      <a [class.active]="!activeTag" (click)="filterByTag(null)">all</a>
      @for (tag of tags; track tag.tagId) {
        <a [class.active]="activeTag?.tagId === tag.tagId" (click)="filterByTag(tag)">{{ tag.tagName }}</a>
      }
    </div>

    <ul class="post-list">
      @for (post of filteredPosts; track post.postId) {
        <li>
          <a [routerLink]="['/posts', post.postId]">{{ post.title }}</a>
          <span class="muted">
            {{ post.createdAt | date:'mediumDate' }} &middot; {{ post.viewCount }} views
          </span>
          @if (post.tags && post.tags.length > 0) {
            <span class="muted">
              &middot;
              @for (tag of post.tags; track tag.tagId; let last = $last) {
                {{ tag.tagName }}{{ last ? '' : ', ' }}
              }
            </span>
          }
        </li>
      }
    </ul>

    @if (filteredPosts.length === 0) {
      <p class="muted">No posts found.</p>
    }

    <hr>
    <p><a routerLink="/posts/new">Write a new post</a></p>
  `,
  styleUrl: './archives.component.css'
})
export class ArchivesComponent implements OnInit {
  private postService = inject(PostService);
  private tagService = inject(TagService);
  private cdr = inject(ChangeDetectorRef);

  allPosts: Post[] = [];
  filteredPosts: Post[] = [];
  tags: Tag[] = [];
  currentSort = 'recent';
  activeTag: Tag | null = null;

  ngOnInit() {
    this.tagService.getTags('all').subscribe(tags => {
      this.tags = tags;
      this.cdr.markForCheck();
    });
    this.loadPosts();
  }

  setSort(sort: string) {
    this.currentSort = sort;
    this.loadPosts();
  }

  filterByTag(tag: Tag | null) {
    this.activeTag = tag;
    this.applyFilter();
  }

  private loadPosts() {
    this.postService.getPosts(this.currentSort).subscribe(posts => {
      this.allPosts = posts;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  private applyFilter() {
    if (this.activeTag) {
      this.filteredPosts = this.allPosts.filter(p =>
        p.tags?.some(t => t.tagId === this.activeTag!.tagId)
      );
    } else {
      this.filteredPosts = [...this.allPosts];
    }
  }
}
