import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Home feed
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  // User profile / Block page (own profile or another student's block)
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:username', component: UserProfileComponent, canActivate: [authGuard] },
  // Guest-only routes (redirects logged-in users to '/')
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  // Wildcard fallback
  { path: '**', redirectTo: '' }
];


