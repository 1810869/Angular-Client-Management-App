import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientService } from './client.service';

@Component({
  standalone: true,
  selector: 'client-list',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Client Manager</p>
          <h1>Clients</h1>
          <p class="subtitle">Browse clients, inspect records, edit details, and add new posts.</p>
        </div>
        <label class="search-label">
          Search clients
          <input type="search" [(ngModel)]="search" placeholder="Search by name, username, or email" />
        </label>
      </div>

      <div *ngIf="clientService.isLoading()" class="state">Loading clients…</div>
      <div *ngIf="clientService.loadError() as error" class="state error">{{ error }}</div>
      <div *ngIf="!clientService.isLoading() && !clientService.loadError() && filteredClients.length === 0" class="state">
        No clients match your search.
      </div>

      <ul class="client-grid" *ngIf="!clientService.isLoading() && !clientService.loadError() && filteredClients.length">
        <li class="client-card" *ngFor="let client of filteredClients">
          <div class="card-header">
            <div>
              <h2>{{ client.name }}</h2>
              <p>{{ client.username }} · {{ client.email }}</p>
            </div>
            <span class="badge">#{{ client.id }}</span>
          </div>
          <p>{{ client.company.name }}</p>
          <p class="client-meta">{{ client.address.city }} · {{ client.phone }} · {{ client.website }}</p>
          <div class="card-actions">
            <a [routerLink]="['/clients', client.id]">View</a>
            <a [routerLink]="['/clients', client.id, 'edit']">Edit</a>
          </div>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .page-shell {
        display: grid;
        gap: 2rem;
      }

      .page-header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1.5rem;
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

      h1 {
        margin: 0;
        font-size: clamp(2rem, 2.4vw, 2.6rem);
      }

      .subtitle {
        margin: 0.5rem 0 0;
        color: #475569;
        max-width: 48rem;
      }

      .search-label {
        display: grid;
        gap: 0.75rem;
        max-width: 42rem;
        background: var(--surface);
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
      }

      .search-label input {
        width: 100%;
        padding: 0.95rem 1rem;
        border: 1px solid var(--border);
        border-radius: 0.95rem;
        background: var(--surface-muted);
        color: #0f172a;
      }

      .search-label input:focus {
        border-color: #2563eb;
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

      .client-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .client-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 1.5rem;
        padding: 1.35rem 1.35rem;
        display: grid;
        gap: 1rem;
        box-shadow: var(--shadow);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .client-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 30px 90px rgba(15, 23, 42, 0.12);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
      }

      .client-card h2 {
        margin: 0;
        font-size: 1.15rem;
      }

      .client-card p {
        margin: 0;
        color: #475569;
      }

      .client-meta {
        color: var(--text-muted);
      }

      .badge {
        background: rgba(37, 99, 235, 0.12);
        color: var(--primary);
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 700;
      }

      .card-actions {
        display: flex;
        gap: 0.85rem;
        flex-wrap: wrap;
      }

      .card-actions a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        padding: 0.65rem 0.95rem;
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.08);
        transition: background 0.2s ease;
      }

      .card-actions a:hover {
        background: rgba(37, 99, 235, 0.18);
      }

      @media (max-width: 720px) {
        .page-header {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ClientListComponent {
  search = '';

  constructor(public readonly clientService: ClientService) {
    this.clientService.loadClients();
  }

  get filteredClients() {
    const query = this.search.trim().toLowerCase();
    if (!query) {
      return this.clientService.clientList();
    }

    return this.clientService.clientList().filter((client) => {
      return (
        client.name.toLowerCase().includes(query) ||
        client.username.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      );
    });
  }
}
