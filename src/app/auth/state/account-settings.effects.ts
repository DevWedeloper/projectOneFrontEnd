import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { UserApiService } from '../data-access/user-api.service';
import { accountSettingsActions } from './account-settings.actions';

@Injectable()
export class AccountSettingsEffects {
  private actions$ = inject(Actions);
  private route = inject(Router);
  private userApiService = inject(UserApiService);

  updateEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountSettingsActions.updateUserEmail),
      switchMap((action) =>
        this.userApiService.updateEmailByEmail(
          action.newEmail,
          action.verificationCode,
        ),
      ),
      map(() => accountSettingsActions.updateUserEmailSuccess()),
      catchError((error) =>
        of(accountSettingsActions.updateUserEmailFailure()),
      ),
    ),
  );

  updateUsername$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountSettingsActions.updateUserUsername),
      switchMap((action) =>
        this.userApiService.updateUsernameByEmail(
          action.username,
          action.verificationCode,
        ),
      ),
      map(() => accountSettingsActions.updateUserUsernameSuccess()),
      catchError(() => of(accountSettingsActions.updateUserUsernameFailure())),
    ),
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountSettingsActions.updateUserPassword),
      switchMap((action) =>
        this.userApiService.updatePasswordByEmail(
          action.password,
          action.newPassword,
        ),
      ),
      map(() => accountSettingsActions.updateUserPasswordSuccess()),
      catchError(() => of(accountSettingsActions.updateUserPasswordFailure())),
    ),
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountSettingsActions.deleteAccount),
      switchMap((action) =>
        this.userApiService.deleteUserByEmail(action.password),
      ),
      map(() => accountSettingsActions.deleteAccountSuccess()),
      catchError(() => of(accountSettingsActions.deleteAccountFailure())),
    ),
  );

  deleteAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountSettingsActions.deleteAccountSuccess),
        tap(() => this.route.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}
