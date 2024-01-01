import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthApiService } from '../auth-api.service';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap, timer } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);
  private authService = inject(AuthService);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.login),
      switchMap((user) => {
        return this.authApiService.login(user).pipe(
          map((response) => {
            this.authService.setAccessToken(response.accessToken);
            this.authService.setCurrentUser(response.userId);
            return authActions.loginSuccess();
          }),
          catchError((error) => of(authActions.loginFailure({ error }))),
        );
      }),
    );
  });

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/']);
        }),
      );
    },
    { dispatch: false },
  );

  loginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginFailure),
        tap(() => {
          this.router.navigate(['/login']);
        }),
      );
    },
    { dispatch: false },
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logout),
        switchMap(() => {
          this.authService.clearAccessToken();
          this.authService.clearCurrentUser();
          this.router.navigate(['/login']);
          return this.authApiService.logout(this.authService.getCurrentUser());
        }),
      );
    },
    { dispatch: false },
  );

  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.refreshToken),
      switchMap(() => {
        return this.authApiService
          .refreshToken(this.authService.getCurrentUser())
          .pipe(
            map((response) => {
              this.authService.setAccessToken(response.accessToken);
              return authActions.refreshTokenSuccess();
            }),
            catchError((error) => {
              return of(authActions.refreshTokenFailure({ error }));
            }),
          );
      }),
    );
  });

  refreshTokenSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.refreshTokenSuccess),
      map(() => authActions.autoLogout()),
    );
  });

  refreshTokenFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.refreshTokenFailure),
      map((error) => {
        if (error.error.error.error === 'Token expired') {
          confirm('Your session has expired, please login again.');
        }
        return authActions.logout();
      }),
    );
  });

  setUserId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSuccess, authActions.refreshTokenSuccess),
      map(() => {
        return authActions.setUserId({
          userId: this.authService.decodedToken().userId,
        });
      }),
    );
  });

  setUserRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        authActions.loginSuccess,
        authActions.refreshTokenSuccess,
        authActions.getUserRole,
      ),
      map(() => {
        return authActions.setUserRole({
          role: this.authService.decodedToken().role,
        });
      }),
    );
  });

  autoLogout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.autoLogout),
      switchMap(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry =
          this.authService.decodedToken().exp - currentTime;
        return timer(timeUntilExpiry * 1000).pipe(
          map(() => {
            return authActions.refreshToken();
          }),
        );
      }),
    );
  });
}
