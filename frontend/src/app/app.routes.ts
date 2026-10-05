import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Home feed
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  // User search and discovery
  { path: 'search', component: UserSearchComponent, canActivate: [authGuard] },
  // User profile page (own profile or another student's profile)
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:username', component: UserProfileComponent, canActivate: [authGuard] },
  // Guest-only routes (redirects logged-in users to '/')
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  // Wildcard fallback
  { path: '**', redirectTo: '' }
];


