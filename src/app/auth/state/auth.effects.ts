import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../auth-api.service';
import { authActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      switchMap((action) =>
        this.authApiService.login(action.user).pipe(
          map(() => authActions.loginSuccess()),
          catchError((error) => of(authActions.loginFailure({ error }))),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginFailure),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      switchMap(() => this.authApiService.logout()),
      map(() => authActions.logoutSuccess()),
      catchError(() => of(authActions.logoutFailure())),
    ),
  );

  logoutSuccessOrFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess, authActions.logoutFailure),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshToken),
      switchMap(() =>
        this.authApiService.refreshToken().pipe(
          map(() => authActions.refreshTokenSuccess()),
          catchError((error) => of(authActions.refreshTokenFailure({ error }))),
        ),
      ),
    ),
  );

  refreshTokenFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshTokenFailure),
      map((error) => {
        if (error.error.error.error === 'Token expired') {
          confirm('Your session has expired, please login again.');
        }
        return authActions.logout();
      }),
    ),
  );

  getUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loadUserRole),
      switchMap(() => this.authApiService.getRole()),
      map((role) => authActions.loadUserRoleSuccess(role)),
      catchError(() => of(authActions.loadUserRoleFailure())),
    ),
  );
}
