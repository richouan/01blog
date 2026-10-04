import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Home feed protected by AuthGuard
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  // Guest-only routes (redirects logged-in users to '/')
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  // Wildcard fallback
  { path: '**', redirectTo: '' }
];


