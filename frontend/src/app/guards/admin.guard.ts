import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protects admin-only routes (/admin) by redirecting non-admin users to '/'
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  if (currentUser && currentUser.role === 'ROLE_ADMIN') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
