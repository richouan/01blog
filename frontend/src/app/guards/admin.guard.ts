import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

// Protects admin-only routes (/admin) by verifying claims and server attestation
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn() || !authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }

  // Double check with backend: ensures token signature is authentic and user actually holds ROLE_ADMIN in database
  return authService.verifySession().pipe(
    map(verifiedUser => {
      if (verifiedUser && verifiedUser.role === 'ROLE_ADMIN') {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};

