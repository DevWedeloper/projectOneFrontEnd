import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './data-access/auth.service';

export const LoginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => (!isAuthenticated ? true : router.parseUrl('/'))),
    catchError(() => of(router.parseUrl('/login'))),
  );
};
