import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

// Attach JWT Bearer token to outgoing HTTP requests and auto-logout on 401 or banned 403 errors
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the backend flagged this account as banned or suspended
      const isBanned = error.status === 403 && (
        error.error?.error === 'ACCOUNT_BANNED' ||
        (typeof error.error?.message === 'string' && error.error.message.toLowerCase().includes('banned')) ||
        (typeof error.error?.message === 'string' && error.error.message.toLowerCase().includes('suspended'))
      );

      if (isBanned) {
        authService.logout(false);
        const banMessage = typeof error.error?.message === 'string'
          ? error.error.message
          : 'Your account has been suspended or banned by an administrator.';
        router.navigate(['/login'], {
          state: { wasBanned: true, bannedReason: banMessage }
        });
        return throwError(() => error);
      }

      // If server returns 401 Unauthorized on protected routes, automatically clear session and redirect to login
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

