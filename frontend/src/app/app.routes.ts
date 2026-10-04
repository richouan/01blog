import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  // Default route redirects to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Wildcard fallback redirects to login
  { path: '**', redirectTo: 'login' }
];
