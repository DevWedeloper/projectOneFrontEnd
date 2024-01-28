import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { UserApiService } from '../data-access/user-api.service';
import { signUpActions } from './sign-up.actions';

@Injectable()
export class SignUpEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private userApiService = inject(UserApiService);

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUpActions.signUp),
      switchMap((action) =>
        this.userApiService.createUser(action.user).pipe(
          map(() => signUpActions.signUpSuccess()),
          catchError((error) => of(signUpActions.signUpFailure(error))),
        ),
      ),
    ),
  );

  signUpSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signUpActions.signUpSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}
