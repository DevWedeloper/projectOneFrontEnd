import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserSignUp } from '../interface/user-sign-up.type';

export const signUpActions = createActionGroup({
  source: 'Sign-Up',
  events: {
    'Sign Up': props<{ user: UserSignUp }>(),
    'Sign Up Success': emptyProps(),
    'Sign Up Failure': props<{ error: HttpErrorResponse }>(),
    'Reset State On Destroy': emptyProps(),
  },
});
