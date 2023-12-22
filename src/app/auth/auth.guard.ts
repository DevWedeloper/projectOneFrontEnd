import { inject } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  if (authService.isAuthenticated()) {
    return true;
  }

  return authService.refreshToken().pipe(
    switchMap(() => {
      return of(true);
    })
  );
};
