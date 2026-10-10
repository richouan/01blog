import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard, guestGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Home feed
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  // Single post permalink detail view
  { path: 'posts/:id', component: PostDetailComponent, canActivate: [authGuard] },
  { path: 'post/:id', redirectTo: 'posts/:id' },
  // User search and discovery
  { path: 'search', component: UserSearchComponent, canActivate: [authGuard] },
  // User profile page (own profile or another student's profile)
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:username', component: UserProfileComponent, canActivate: [authGuard] },
  // Admin moderation dashboard (Role: ROLE_ADMIN only)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  // Guest-only routes (redirects logged-in users to '/')
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  // Wildcard 404 fallback page
  { path: '**', component: NotFoundComponent }
];


