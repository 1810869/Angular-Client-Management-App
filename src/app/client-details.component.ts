import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from './client.service';
import { PostFormComponent } from './post-form.component';
import { Client, Post } from './models';

@Component({
  standalone: true,
  selector: 'client-details',
  imports: [CommonModule, FormsModule, RouterModule, PostFormComponent],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Client details</p>
          <h1>{{ client?.name || 'Loading client…' }}</h1>
        </div>
        <div class="actions">
          <a [routerLink]="['/']">Back to client list</a>
          <a class="secondary" *ngIf="client" [routerLink]="['/clients', client.id, 'edit']">Edit</a>
        </div>
      </div>

      <div *ngIf="loading()" class="state">Loading client details…</div>
      <div *ngIf="error() as message" class="state error">{{ message }}</div>

      <article *ngIf="client && !loading()" class="details-grid">
        <section class="details-card">
          <h2>Contact information</h2>
          <div class="detail-row"><span class="detail-label">Username</span><span>{{ client.username }}</span></div>
          <div class="detail-row"><span class="detail-label">Email</span><span>{{ client.email }}</span></div>
          <div class="detail-row"><span class="detail-label">Phone</span><span>{{ client.phone }}</span></div>
          <div class="detail-row"><span class="detail-label">Website</span><span>{{ client.website }}</span></div>
          <div class="detail-row"><span class="detail-label">Company</span><span>{{ client.company.name }}</span></div>
        </section>

        <section class="details-card">
          <h2>Address</h2>
          <div class="detail-row"><span class="detail-label">Street</span><span>{{ client.address.street }}</span></div>
          <div class="detail-row"><span class="detail-label">Suite</span><span>{{ client.address.suite }}</span></div>
          <div class="detail-row"><span class="detail-label">City</span><span>{{ client.address.city }}</span></div>
          <div class="detail-row"><span class="detail-label">Zipcode</span><span>{{ client.address.zipcode }}</span></div>
        </section>
      </article>

      <div *ngIf="client" class="posts-section">
        <post-form [userId]="client.id" (postCreated)="createPost($event)"></post-form>

        <div class="posts-list">
          <h2>Posts</h2>
          <div *ngIf="postsLoading()" class="state">Loading posts…</div>
          <div *ngIf="postsError() as postsError" class="state error">{{ postsError }}</div>
          <div *ngIf="!postsLoading() && !postsError() && posts.length === 0" class="state">
            This client has no posts yet.
          </div>

          <article *ngFor="let post of posts" class="post-card">
            <div class="post-header">
              <h3>{{ post.title }}</h3>
              <button type="button" class="edit-post" (click)="startPostEdit(post)">Edit</button>
            </div>

            <div *ngIf="editingPost?.id === post.id; else displayPost">
              <label>
                Title
                <input [(ngModel)]="editTitle" />
              </label>
              <label>
                Body
                <textarea rows="4" [(ngModel)]="editBody"></textarea>
              </label>
              <div class="post-actions">
                <button type="button" (click)="savePostEdit()" [disabled]="!editTitle.trim() || !editBody.trim()">Save</button>
                <button type="button" class="cancel" (click)="cancelPostEdit()">Cancel</button>
              </div>
            </div>
            <ng-template #displayPost>
              <p>{{ post.body }}</p>
            </ng-template>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      .eyebrow {
        margin: 0;
        font-size: 0.85rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #2563eb;
        font-weight: 700;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .actions a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1rem;
        border-radius: 0.95rem;
        color: #ffffff;
        background: #2563eb;
        text-decoration: none;
        font-weight: 600;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .actions a:hover {
        transform: translateY(-1px);
        background: #1d4ed8;
      }

      .actions a.secondary {
        background: var(--surface);
        color: #0f172a;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
      }

      .details-grid {
        display: grid;
        gap: 1.75rem;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
      }

      .details-card {
        padding: 1.4rem;
        background: var(--surface);
        border-radius: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
      }

      .details-card h2 {
        margin-top: 0;
        margin-bottom: 1rem;
      }

      .detail-row {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 0.8rem;
        align-items: baseline;
        margin: 0.55rem 0;
      }

      .detail-label {
        font-weight: 700;
        color: #334155;
      }

      .details-card p {
        margin: 0.65rem 0;
        color: #475569;
      }

      .posts-section {
        display: grid;
        gap: 1.75rem;
      }

      .posts-list {
        display: grid;
        gap: 1.25rem;
      }

      .post-card {
        padding: 1.25rem;
        background: var(--surface);
        border-radius: 1.25rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        transition: transform 0.2s ease;
      }

      .post-card:hover {
        transform: translateY(-1px);
      }

      .post-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
      }

      .post-header h3 {
        margin: 0;
        font-size: 1.05rem;
      }

      .edit-post {
        border: none;
        background: transparent;
        color: var(--primary);
        font-weight: 700;
        cursor: pointer;
      }

      .edit-post:hover {
        text-decoration: underline;
      }

      label {
        display: grid;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.9rem 1rem;
        border-radius: 0.95rem;
        border: 1px solid var(--border);
        background: var(--surface-muted);
        color: #000000;
      }

      .post-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }

      .post-actions button {
        border: none;
        border-radius: 0.95rem;
        padding: 0.85rem 1.15rem;
        cursor: pointer;
        font-weight: 600;
      }

      .post-actions button:not(.cancel) {
        background: #2563eb;
        color: #ffffff;
      }

      .post-actions .cancel {
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid var(--border);
      }

      .post-card h3 {
        margin: 0 0 0.5rem;
      }

      .state {
        padding: 1rem 1.15rem;
        border-radius: 1rem;
        background: #e2e8f0;
        color: #0f172a;
        box-shadow: var(--shadow);
      }

      .state.error {
        background: #fee2e2;
        color: #991b1b;
      }

      @media (max-width: 720px) {
        .page-header {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ClientDetailsComponent {
  client?: Client;
  posts: Post[] = [];
  loading = signal(true);
  error = signal('');
  postsLoading = signal(true);
  postsError = signal('');

  constructor(private route: ActivatedRoute, private router: Router, private service: ClientService) {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error.set('Client not found.');
        this.loading.set(false);
        return;
      }
      this.loadClient(id);
    });
  }

  private async loadClient(id: number) {
    this.loading.set(true);
    this.error.set('');
    this.postsLoading.set(true);
    this.postsError.set('');

    const client = await this.service.getClient(id);
    if (!client) {
      this.error.set('Client not found.');
      this.loading.set(false);
      this.postsLoading.set(false);
      return;
    }

    this.client = client;
    this.loading.set(false);

    try {
      this.posts = await this.service.getPosts(id);
    } catch (error) {
      this.postsError.set((error as Error).message || 'Unable to load posts.');
      this.posts = [];
    } finally {
      this.postsLoading.set(false);
    }
  }

  editingPost?: Post;
  editTitle = '';
  editBody = '';

  createPost(post: Post) {
    if (!this.client) {
      return;
    }
    const newPost = this.service.createPost(this.client.id, post.title, post.body);
    this.posts = [newPost, ...this.posts];
  }

  startPostEdit(post: Post) {
    this.editingPost = post;
    this.editTitle = post.title;
    this.editBody = post.body;
  }

  cancelPostEdit() {
    this.editingPost = undefined;
    this.editTitle = '';
    this.editBody = '';
  }

  savePostEdit() {
    if (!this.client || !this.editingPost) {
      return;
    }
    const updated = this.service.updatePost(this.client.id, this.editingPost.id, this.editTitle.trim(), this.editBody.trim());
    this.posts = this.posts.map((post) => (post.id === updated.id ? updated : post));
    this.cancelPostEdit();
  }
}
