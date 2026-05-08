import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ClientEditComponent } from './client-edit.component';

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<ClientEditComponent> {
  canDeactivate(component: ClientEditComponent): boolean {
    return component.canDeactivate();
  }
}
