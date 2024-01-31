import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { accountSettingsActions } from './account-settings.actions';

type Status = 'pending' | 'loading' | 'error' | 'success';

type AccountSettingsState = {
  updateEmailStatus: Status;
  updateUsernameStatus: Status;
  updatePasswordStatus: Status;
  deleteAccountStatus: Status;
};

const initialState: AccountSettingsState = {
  updateEmailStatus: 'pending',
  updateUsernameStatus: 'pending',
  updatePasswordStatus: 'pending',
  deleteAccountStatus: 'pending',
};

const accountSettingsFeature = createFeature({
  name: 'Account Settings',
  reducer: createReducer(
    initialState,
    on(accountSettingsActions.updateUserEmail, (state) => ({
      ...state,
      updateEmailStatus: 'loading' as const,
    })),
    on(accountSettingsActions.updateUserEmailSuccess, (state) => ({
      ...state,
      updateEmailStatus: 'success' as const,
    })),
    on(accountSettingsActions.updateUserEmailFailure, (state) => ({
      ...state,
      updateEmailStatus: 'error' as const,
    })),
    on(accountSettingsActions.updateUserUsername, (state) => ({
      ...state,
      updateUsernameStatus: 'loading' as const,
    })),
    on(accountSettingsActions.updateUserUsernameSuccess, (state) => ({
      ...state,
      updateUsernameStatus: 'success' as const,
    })),
    on(accountSettingsActions.updateUserUsernameFailure, (state) => ({
      ...state,
      updateUsernameStatus: 'error' as const,
    })),
    on(accountSettingsActions.updateUserPassword, (state) => ({
      ...state,
      updatePasswordStatus: 'loading' as const,
    })),
    on(accountSettingsActions.updateUserPasswordSuccess, (state) => ({
      ...state,
      updatePasswordStatus: 'success' as const,
    })),
    on(accountSettingsActions.updateUserPasswordFailure, (state) => ({
      ...state,
      updatePasswordStatus: 'error' as const,
    })),
    on(accountSettingsActions.deleteAccount, (state) => ({
      ...state,
      deleteUserStatus: 'loading' as const,
    })),
    on(accountSettingsActions.deleteAccountSuccess, (state) => ({
      ...state,
      deleteUserStatus: 'success' as const,
    })),
    on(accountSettingsActions.deleteAccountFailure, (state) => ({
      ...state,
      deleteUserStatus: 'error' as const,
    })),
  ),
  extraSelectors: ({
    selectUpdateEmailStatus,
    selectUpdateUsernameStatus,
    selectUpdatePasswordStatus,
    selectDeleteAccountStatus,
  }) => ({
    selectIsUpdatingEmail: createSelector(
      selectUpdateEmailStatus,
      (updateEmailStatus) => updateEmailStatus === 'loading',
    ),
    selectIsUpdatingUsername: createSelector(
      selectUpdateUsernameStatus,
      (updateUsernameStatus) => updateUsernameStatus === 'loading',
    ),
    selectIsUpdatingPassword: createSelector(
      selectUpdatePasswordStatus,
      (updatePasswordStatus) => updatePasswordStatus === 'loading',
    ),
    selectIsDeletingAccount: createSelector(
      selectDeleteAccountStatus,
      (deleteUserStatus) => deleteUserStatus === 'loading',
    ),
  }),
});

export const {
  name: accountSettingsFeatureKey,
  reducer: accountSettingsReducer,
  selectIsUpdatingEmail,
  selectIsUpdatingUsername,
  selectIsUpdatingPassword,
  selectIsDeletingAccount,
} = accountSettingsFeature;
