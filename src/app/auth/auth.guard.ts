import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }

  return authService.refreshToken().pipe(
    switchMap(() => {
      return of(true);
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};