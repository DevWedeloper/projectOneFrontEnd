import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { UserApiService } from '../data-access/user-api.service';
import { passwordRecoveryActions } from './password-recovery.actions';

@Injectable()
export class PasswordRecoveryEffects {
  private actions$ = inject(Actions);
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
}
