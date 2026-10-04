import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect empty root path to login by default
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Wildcard route to catch invalid URLs
  { path: '**', redirectTo: '' }
];
