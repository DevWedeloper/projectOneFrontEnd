import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const accountSettingsActions = createActionGroup({
  source: 'Account Settings',
  events: {
    'Update User Email': props<{
      newEmail: string;
      verificationCode: string;
    }>(),
    'Update User Email Success': emptyProps(),
    'Update User Email Failure': emptyProps(),
    'Update User Username': props<{
      username: string;
      verificationCode: string;
    }>(),
    'Update User Username Success': emptyProps(),
    'Update User Username Failure': emptyProps(),
    'Update User Password': props<{
      password: string;
      newPassword: string;
    }>(),
    'Update User Password Success': emptyProps(),
    'Update User Password Failure': emptyProps(),
    'Delete Account': props<{
      password: string;
    }>(),
    'Delete Account Success': emptyProps(),
    'Delete Account Failure': emptyProps(),
  },
});