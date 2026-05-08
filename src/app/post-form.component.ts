import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from './models';

@Component({
  standalone: true,
  selector: 'post-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="post-form">
      <h2>Add new post</h2>
      <label>
        Title
        <input formControlName="title" placeholder="Post title" />
      </label>
      <label>
        Body
        <textarea formControlName="body" rows="4" placeholder="Post body"></textarea>
      </label>
      <div class="form-actions">
        <button type="submit" [disabled]="form.invalid">Publish post</button>
      </div>
    </form>
  `,
  styles: [
    `
      .post-form {
        display: grid;
        gap: 1rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 1.5rem;
        padding: 1.25rem;
        box-shadow: var(--shadow);
      }

      .post-form h2 {
        margin: 0;
        font-size: 1.15rem;
        color: #0f172a;
      }

      .post-form label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.95rem;
        color: #334155;
      }

      .post-form input,
      .post-form textarea {
        width: 100%;
        min-width: 0;
        padding: 0.95rem 1rem;
        border-radius: 0.95rem;
        border: 1px solid var(--border);
        background: var(--surface-muted);
        color: #0f172a;
        transition: border-color 0.2s ease;
      }

      .post-form input:focus,
      .post-form textarea:focus {
        border-color: #2563eb;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      .post-form button {
        border: none;
        background: #2563eb;
        color: #ffffff;
        padding: 0.95rem 1.25rem;
        border-radius: 0.95rem;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 14px 34px rgba(37, 99, 235, 0.18);
      }

      .post-form button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      .post-form button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class PostFormComponent {
  @Input() userId?: number;
  @Output() postCreated = new EventEmitter<Post>();

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

  submit() {
    if (!this.userId || this.form.invalid) {
      return;
    }

    const values = this.form.value as { title: string; body: string };
    this.postCreated.emit({
      userId: this.userId,
      id: 0,
      title: (values.title ?? '').trim(),
      body: (values.body ?? '').trim(),
    });

    this.form.reset();
  }
}
