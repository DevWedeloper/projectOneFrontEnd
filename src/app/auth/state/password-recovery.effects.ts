import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap, tap } from 'rxjs';
import { UserApiService } from '../data-access/user-api.service';
import { passwordRecoveryActions } from './password-recovery.actions';

@Injectable()
export class PasswordRecoveryEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private userApiService = inject(UserApiService);

  forgetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(passwordRecoveryActions.forgotPassword),
      switchMap((action) =>
        this.userApiService.forgotPassword(action.email).pipe(
          map(() => passwordRecoveryActions.forgotPasswordSuccess()),
          catchError((error) =>
            of(passwordRecoveryActions.forgotPasswordFailure(error)),
          ),
        ),
      ),
    ),
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(passwordRecoveryActions.resetPassword),
      switchMap((action) =>
        this.userApiService.resetPassword(action.password, action.token).pipe(
          map(() => passwordRecoveryActions.resetPasswordSuccess()),
          catchError((error) =>
            of(passwordRecoveryActions.resetPasswordFailure(error)),
          ),
        ),
      ),
    ),
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(passwordRecoveryActions.resetPasswordSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );

  resetPasswordFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(passwordRecoveryActions.resetPasswordFailure),
        delay(5000),
        tap(() => this.router.navigate(['/forgot-password'])),
      ),
    { dispatch: false },
  );
}
