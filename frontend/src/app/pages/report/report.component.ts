import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, startWith, debounceTime, switchMap } from 'rxjs';
import { Post, Tag, User, ReportResponse } from '../../models/models';
import { ReportService } from '../../services/report.service';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, ReactiveFormsModule],
  template: `
    <h1>Report</h1>

    <div class="filter-row">
      <label>
        Start date
        <input type="date" [formControl]="filters.controls.startDate">
      </label>
      <label>
        End date
        <input type="date" [formControl]="filters.controls.endDate">
      </label>
      <label>
        Tag
        <select [formControl]="filters.controls.tagId">
          <option value="">All tags</option>
          @for (tag of tags; track tag.tagId) {
            <option [value]="tag.tagId">{{ tag.tagName }}</option>
          }
        </select>
      </label>
      <label>
        Author
        <select [formControl]="filters.controls.authorId">
          <option value="">All authors</option>
          @for (user of users; track user.userId) {
            <option [value]="user.userId">{{ user.username }}</option>
          }
        </select>
      </label>
    </div>

    @if (report) {
      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{{ report.stats.totalPosts }}</span>
          <span class="stat-label">Total Posts</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ report.stats.avgViews | number:'1.1-1' }}</span>
          <span class="stat-label">Avg Views</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ report.stats.avgComments | number:'1.1-1' }}</span>
          <span class="stat-label">Avg Comments</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ report.stats.mostActiveAuthor || '—' }}</span>
          <span class="stat-label">Most Active Author</span>
        </div>
      </div>

      <h2>Filtered Posts ({{ report.posts.length }})</h2>
      <ul class="post-list">
        @for (post of report.posts; track post.postId) {
          <li>
            <a [routerLink]="['/posts', post.postId]">{{ post.title }}</a>
            <span class="muted">
              {{ post.createdAt | date:'mediumDate' }} &middot;
              {{ post.viewCount }} views
            </span>
          </li>
        }
      </ul>

      @if (report.posts.length === 0) {
        <p class="muted">No posts match the current filters.</p>
      }
    }
  `,
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private tagService = inject(TagService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  tags: Tag[] = [];
  users: User[] = [];
  report: ReportResponse | null = null;
  private sub?: Subscription;

  filters = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    tagId: new FormControl(''),
    authorId: new FormControl('')
  });

  ngOnInit() {
    this.tagService.getTags('all').subscribe(tags => {
      this.tags = tags;
      this.cdr.markForCheck();
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.cdr.markForCheck();
    });

    this.sub = this.filters.valueChanges.pipe(
      startWith(this.filters.value),
      debounceTime(300),
      switchMap(vals => this.reportService.getReport({
        startDate: vals.startDate || null,
        endDate: vals.endDate || null,
        tagId: vals.tagId || null,
        authorId: vals.authorId || null
      }))
    ).subscribe(report => {
      this.report = report;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
