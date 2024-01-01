import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../interface/user.interface';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<User>(),
    'Login Success': emptyProps(),
    'Login Failure': props<{ error: HttpErrorResponse }>(),
    Logout: emptyProps(),
    'Refresh Token': emptyProps(),
    'Refresh Token Success': emptyProps(),
    'Refresh Token Failure': props<{ error: HttpErrorResponse }>(),
    'Set UserId': props<{ userId: string }>(),
    'Get User Role': emptyProps(),
    'Set User Role': props<{ role: string }>(),
    'Auto Logout': emptyProps(),
  },
});
