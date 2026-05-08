import { CommonModule } from '@angular/common';
import { Component, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from './client.service';
import { Client } from './models';

@Component({
  standalone: true,
  selector: 'client-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Edit client</p>
          <h1>Edit {{ client?.name || 'client' }}</h1>
        </div>
        <div class="actions">
          <a [routerLink]="['/clients', client?.id]">Back</a>
        </div>
      </div>

      <div *ngIf="loading()" class="state">Loading client data…</div>
      <div *ngIf="error() as message" class="state error">{{ message }}</div>

      <form *ngIf="client && !loading()" [formGroup]="form" (ngSubmit)="save()" class="edit-form">
        <fieldset>
          <legend>Identity</legend>

          <label>
            Full name
            <input formControlName="name" />
            <span *ngIf="form.controls.name.invalid && form.controls.name.touched" class="field-error">
              Name is required.
            </span>
          </label>

          <label>
            Email
            <input formControlName="email" />
            <span *ngIf="form.controls.email.invalid && form.controls.email.touched" class="field-error">
              Enter a valid email.
            </span>
          </label>

          <label>
            Phone
            <input formControlName="phone" />
          </label>

          <label>
            Website
            <input formControlName="website" />
          </label>
        </fieldset>

        <fieldset>
          <legend>Address</legend>

          <label>
            Street
            <input formControlName="street" />
          </label>

          <label>
            Suite
            <input formControlName="suite" />
          </label>

          <label>
            City
            <input formControlName="city" />
          </label>

          <label>
            Zipcode
            <input formControlName="zipcode" />
          </label>
        </fieldset>

        <fieldset>
          <legend>Company</legend>
          <label>
            Company name
            <input formControlName="company" />
          </label>
        </fieldset>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">Save changes</button>
          <span *ngIf="form.dirty" class="unsaved">Unsaved changes</span>
        </div>
      </form>
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

      .edit-form {
        display: grid;
        gap: 2rem;
      }

      fieldset {
        border: none;
        border-radius: 1.5rem;
        padding: 1.25rem;
        background: var(--surface);
        box-shadow: var(--shadow);
      }

      legend {
        padding: 0 0.5rem;
        font-weight: 700;
        color: #0f172a;
      }

      label {
        display: grid;
        gap: 0.5rem;
      }

      input {
        width: 100%;
        padding: 0.95rem 1rem;
        border-radius: 0.95rem;
        border: 1px solid var(--border);
        background: var(--surface-muted);
        transition: border-color 0.2s ease;
      }

      input:focus {
        border-color: #2563eb;
        background: #ffffff;
      }

      .form-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .form-actions button {
        padding: 0.95rem 1.3rem;
        border: none;
        background: #2563eb;
        color: white;
        border-radius: 0.95rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 14px 34px rgba(37, 99, 235, 0.18);
      }

      .form-actions button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      .form-actions button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .field-error {
        color: #b91c1c;
        font-size: 0.85rem;
      }

      .unsaved {
        color: #f97316;
        font-weight: 600;
      }

      .actions a {
        padding: 0.75rem 1rem;
        display: inline-flex;
        border-radius: 0.95rem;
        text-decoration: none;
        color: #0f172a;
        background: var(--surface);
        border: 1px solid var(--border);
        font-weight: 600;
        box-shadow: var(--shadow);
        transition: transform 0.2s ease;
      }

      .actions a:hover {
        transform: translateY(-1px);
      }

      @media (max-width: 720px) {
        .page-header {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ClientEditComponent implements OnDestroy {
  client?: Client;
  loading = signal(true);
  error = signal('');
  saved = false;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    website: new FormControl(''),
    street: new FormControl(''),
    suite: new FormControl(''),
    city: new FormControl(''),
    zipcode: new FormControl(''),
    company: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ClientService
  ) {
    window.addEventListener('beforeunload', this.beforeUnload);
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

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnload);
  }

  private beforeUnload = (event: BeforeUnloadEvent) => {
    if (this.form.dirty) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  private async loadClient(id: number) {
    this.loading.set(true);
    this.error.set('');

    const client = await this.service.getClient(id);
    if (!client) {
      this.error.set('Client not found.');
      this.loading.set(false);
      return;
    }

    this.client = client;
    this.form.setValue({
      name: client.name ?? '',
      email: client.email ?? '',
      phone: client.phone ?? '',
      website: client.website ?? '',
      street: client.address.street ?? '',
      suite: client.address.suite ?? '',
      city: client.address.city ?? '',
      zipcode: client.address.zipcode ?? '',
      company: client.company.name ?? '',
    });
    this.form.markAsPristine();
    this.loading.set(false);
  }

  save() {
    if (!this.client || this.form.invalid) {
      return;
    }

    const values = this.form.getRawValue() as {
      name: string;
      email: string;
      phone: string;
      website: string;
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      company: string;
    };

    const updated: Client = {
      ...this.client,
      name: values.name ?? '',
      email: values.email ?? '',
      phone: values.phone ?? '',
      website: values.website ?? '',
      address: {
        street: values.street ?? '',
        suite: values.suite ?? '',
        city: values.city ?? '',
        zipcode: values.zipcode ?? '',
      },
      company: {
        name: values.company ?? '',
      },
    };

    this.service.updateClient(updated);
    this.saved = true;
    this.router.navigate(['/clients', updated.id]);
  }

  canDeactivate(): boolean {
    if (this.form.dirty && !this.saved) {
      return confirm('You have unsaved changes. Leave this page and lose changes?');
    }
    return true;
  }
}
