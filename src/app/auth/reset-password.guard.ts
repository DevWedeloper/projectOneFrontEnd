import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserApiService } from './data-access/user-api.service';

export const ResetPasswordGuard = (next: ActivatedRouteSnapshot) => {
  const userApiService = inject(UserApiService);
  const router = inject(Router);

  const token = next.queryParams['token'];

  return userApiService.isResetPasswordTokenExisting(token).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/forgot-password']);
      return of(false);
    }),
  );
};
