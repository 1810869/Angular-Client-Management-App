import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list.component';
import { ClientDetailsComponent } from './client-details.component';
import { ClientEditComponent } from './client-edit.component';
import { UnsavedChangesGuard } from './unsaved-changes.guard';

export const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'clients/:id', component: ClientDetailsComponent },
  {
    path: 'clients/:id/edit',
    component: ClientEditComponent,
    canDeactivate: [UnsavedChangesGuard],
  },
  { path: '**', redirectTo: '' },
];
