import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../interface/user.interface';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ user: User }>(),
    'Login Success': emptyProps(),
    'Login Failure': props<{ error: HttpErrorResponse }>(),
    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': emptyProps(),
    'Refresh Token': emptyProps(),
    'Refresh Token Success': emptyProps(),
    'Refresh Token Failure': props<{ error: HttpErrorResponse }>(),
    'Load User Role': emptyProps(),
    'Load User Role Success': props<{ role: string }>(),
    'Load User Role Failure': emptyProps(),
  },
});
