import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Tag } from '../../models/models';
import { PostService } from '../../services/post.service';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>{{ isEdit ? 'Edit post' : 'New post' }}</h1>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        Title
        <input formControlName="title" type="text" placeholder="Post title">
      </label>

      <label>
        Body
        <textarea formControlName="body" rows="16" placeholder="Write your post..."></textarea>
      </label>

      @if (tags.length > 0) {
        <div>
          <span class="muted">Tags</span>
          <div class="checkbox-row">
            @for (tag of tags; track tag.tagId) {
              <label>
                <input type="checkbox"
                  [checked]="selectedTags.has(tag.tagId)"
                  (change)="toggleTag(tag.tagId)">
                {{ tag.tagName }}
              </label>
            }
          </div>
        </div>
      }

      <div class="form-actions">
        <button type="submit" [disabled]="form.invalid">{{ isEdit ? 'Save changes' : 'Publish' }}</button>
        @if (isEdit) {
          <button type="button" class="danger" (click)="deletePost()">Delete post</button>
        }
      </div>
    </form>
  `,
  styleUrl: './post-editor.component.css'
})
export class PostEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private tagService = inject(TagService);
  private cdr = inject(ChangeDetectorRef);

  isEdit = false;
  postId: number | null = null;
  tags: Tag[] = [];
  selectedTags = new Set<number>();

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.tagService.getTags('manual').subscribe(tags => {
      this.tags = tags;
      this.cdr.markForCheck();
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.postId = Number(idParam);
      this.postService.getPost(this.postId).subscribe(post => {
        this.form.patchValue({ title: post.title, body: post.body });
        if (post.tags) {
          post.tags.forEach(t => this.selectedTags.add(t.tagId));
        }
        this.cdr.markForCheck();
      });
    }
  }

  toggleTag(tagId: number) {
    if (this.selectedTags.has(tagId)) {
      this.selectedTags.delete(tagId);
    } else {
      this.selectedTags.add(tagId);
    }
  }

  submit() {
    if (this.form.invalid) return;
    const { title, body } = this.form.value;
    const tagIds = Array.from(this.selectedTags);

    if (this.isEdit && this.postId) {
      this.postService.updatePost(this.postId, { title: title!, body: body!, tagIds }).subscribe(post => {
        this.router.navigate(['/posts', post.postId]);
      });
    } else {
      this.postService.createPost({ title: title!, body: body!, authorId: 1, tagIds }).subscribe(post => {
        this.router.navigate(['/posts', post.postId]);
      });
    }
  }

  deletePost() {
    if (!this.postId) return;
    if (!confirm('Delete this post? This cannot be undone.')) return;
    this.postService.deletePost(this.postId).subscribe(() => {
      this.router.navigate(['/archives']);
    });
  }
}
