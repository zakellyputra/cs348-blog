import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../models/models';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Books</h1>

    @for (section of sections; track section.key) {
      @if (grouped[section.key]?.length) {
        <h2>{{ section.label }}</h2>
        @for (book of grouped[section.key]; track book.bookId) {
          <div class="item-card">
            <strong>{{ book.title }}</strong>
            <span class="muted"> by {{ book.author }}</span>
            @if (book.rating) {
              <span class="muted"> &middot; {{ book.rating }}/5</span>
            }
            @if (book.yearRead) {
              <span class="muted"> &middot; {{ book.yearRead }}</span>
            }
            @if (book.notes) {
              <p class="muted">{{ book.notes }}</p>
            }
            <div class="item-actions">
              <a (click)="editBook(book)">edit</a>
              <a (click)="deleteBook(book.bookId)">delete</a>
            </div>
          </div>
        }
      }
    }

    <hr>
    <a (click)="showForm = !showForm">{{ showForm ? 'Cancel' : 'Add a book' }}</a>

    @if (showForm) {
      <div class="inline-form">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>Title <input formControlName="title" type="text"></label>
          <label>Author <input formControlName="author" type="text"></label>
          <label>
            Status
            <select formControlName="status">
              <option value="reading">Currently Reading</option>
              <option value="read">Read</option>
              <option value="want_to_read">Want to Read</option>
            </select>
          </label>
          <label>Rating (1-5) <input formControlName="rating" type="number" min="1" max="5"></label>
          <label>Year Read <input formControlName="yearRead" type="number"></label>
          <label>Notes <textarea formControlName="notes" rows="3"></textarea></label>
          <label>Cover URL <input formControlName="coverUrl" type="text"></label>
          <div class="form-actions">
            <button type="submit">{{ editingId ? 'Save changes' : 'Add book' }}</button>
            @if (editingId) {
              <button type="button" (click)="cancelEdit()">Cancel edit</button>
            }
          </div>
        </form>
      </div>
    }
  `,
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  grouped: Record<string, Book[]> = {};
  sections = [
    { key: 'reading', label: 'Currently Reading' },
    { key: 'read', label: 'Read' },
    { key: 'want_to_read', label: 'Want to Read' }
  ];

  showForm = false;
  editingId: number | null = null;

  form = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    status: new FormControl('read'),
    rating: new FormControl<number | null>(null),
    yearRead: new FormControl<number | null>(null),
    notes: new FormControl(''),
    coverUrl: new FormControl('')
  });

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.grouped = {};
      for (const b of books) {
        if (!this.grouped[b.status]) this.grouped[b.status] = [];
        this.grouped[b.status].push(b);
      }
      this.cdr.markForCheck();
    });
  }

  editBook(book: Book) {
    this.editingId = book.bookId;
    this.showForm = true;
    this.form.patchValue({
      title: book.title,
      author: book.author,
      status: book.status,
      rating: book.rating,
      yearRead: book.yearRead,
      notes: book.notes,
      coverUrl: book.coverUrl
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ status: 'read' });
  }

  deleteBook(id: number) {
    if (!confirm('Delete this book?')) return;
    this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
  }

  submit() {
    const val = this.form.value;
    const payload: Partial<Book> = {
      title: val.title || '',
      author: val.author || '',
      status: (val.status as Book['status']) || 'read',
      rating: val.rating ?? null,
      yearRead: val.yearRead ?? null,
      notes: val.notes || '',
      coverUrl: val.coverUrl || ''
    };

    if (this.editingId) {
      this.bookService.updateBook(this.editingId, payload).subscribe(() => {
        this.editingId = null;
        this.showForm = false;
        this.form.reset({ status: 'read' });
        this.loadBooks();
      });
    } else {
      this.bookService.createBook(payload).subscribe(() => {
        this.showForm = false;
        this.form.reset({ status: 'read' });
        this.loadBooks();
      });
    }
  }
}
