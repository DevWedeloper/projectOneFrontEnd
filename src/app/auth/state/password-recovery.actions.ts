import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const passwordRecoveryActions = createActionGroup({
  source: 'Password Recovery',
  events: {
    'Forgot Password': props<{ email: string }>(),
    'Forgot Password Success': emptyProps(),
    'Forgot Password Failure': props<{ error: HttpErrorResponse }>(),
    'Reset Password': props<{ password: string, token: string }>(),
    'Reset Password Success': emptyProps(),
    'Reset Password Failure': props<{ error: HttpErrorResponse }>(),
  },
});
