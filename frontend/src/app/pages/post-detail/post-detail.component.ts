import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Post, Comment } from '../../models/models';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  template: `
    @if (post) {
      <article>
        <h1>{{ post.title }}</h1>
        <p class="muted">
          {{ post.authorName || 'Anonymous' }} &middot;
          {{ post.createdAt | date:'longDate' }} &middot;
          {{ post.viewCount }} views
        </p>

        <div class="post-body">{{ post.body }}</div>

        @if (post.tags && post.tags.length > 0) {
          <div class="tag-list">
            @for (tag of post.tags; track tag.tagId) {
              <span>{{ tag.tagName }}</span>
            }
          </div>
        }

        <div class="post-actions">
          <a [routerLink]="['/posts', post.postId, 'edit']">Edit</a>
          <a class="danger-link" (click)="deletePost()">Delete</a>
        </div>
      </article>

      <hr>

      <section>
        <h2>Comments ({{ comments.length }})</h2>

        @for (comment of comments; track comment.commentId) {
          <div class="comment">
            <p class="muted">{{ comment.username || 'Anonymous' }} &middot; {{ comment.createdAt | date:'medium' }}</p>
            <p>{{ comment.body }}</p>
            <a class="muted" (click)="deleteComment(comment.commentId)">delete</a>
          </div>
        }

        @if (comments.length === 0) {
          <p class="muted">No comments yet.</p>
        }

        <h3>Add a comment</h3>
        <form [formGroup]="commentForm" (ngSubmit)="addComment()">
          <label>
            Comment
            <textarea formControlName="body" rows="4" placeholder="Write a comment..."></textarea>
          </label>
          <button type="submit" [disabled]="commentForm.invalid">Post comment</button>
        </form>
      </section>
    }
  `,
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private cdr = inject(ChangeDetectorRef);

  post: Post | null = null;
  comments: Comment[] = [];

  commentForm = new FormGroup({
    body: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPost(id).subscribe(post => {
      this.post = post;
      this.comments = post.comments || [];
      this.cdr.markForCheck();
    });
  }

  addComment() {
    if (!this.post || this.commentForm.invalid) return;
    const body = this.commentForm.value.body!;
    this.commentService.addComment(this.post.postId, { userId: 1, body }).subscribe(comment => {
      this.comments.push(comment);
      this.commentForm.reset();
      this.cdr.markForCheck();
    });
  }

  deleteComment(id: number) {
    if (!confirm('Delete this comment?')) return;
    this.commentService.deleteComment(id).subscribe(() => {
      this.comments = this.comments.filter(c => c.commentId !== id);
      this.cdr.markForCheck();
    });
  }

  deletePost() {
    if (!this.post) return;
    if (!confirm('Delete this post? This cannot be undone.')) return;
    this.postService.deletePost(this.post.postId).subscribe(() => {
      this.router.navigate(['/archives']);
    });
  }
}
