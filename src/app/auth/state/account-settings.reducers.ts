import { HttpErrorResponse } from '@angular/common/http';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { accountSettingsActions } from './account-settings.actions';

type Status = 'pending' | 'loading' | 'error' | 'success';

type AccountSettingsState = {
  updateEmailStatus: Status;
  hasUpdateEmailError: HttpErrorResponse | null;
  updateUsernameStatus: Status;
  hasUpdateUsernameError: HttpErrorResponse | null;
  updatePasswordStatus: Status;
  hasUpdatePasswordError: HttpErrorResponse | null;
  deleteAccountStatus: Status;
  hasDeleteAccountError: HttpErrorResponse | null;
};

const initialState: AccountSettingsState = {
  updateEmailStatus: 'pending',
  hasUpdateEmailError: null,
  updateUsernameStatus: 'pending',
  hasUpdateUsernameError: null,
  updatePasswordStatus: 'pending',
  hasUpdatePasswordError: null,
  deleteAccountStatus: 'pending',
  hasDeleteAccountError: null,
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
      hasUpdateEmailError: null,
    })),
    on(accountSettingsActions.updateUserEmailFailure, (state, action) => ({
      ...state,
      updateEmailStatus: 'error' as const,
      hasUpdateEmailError: action.error,
    })),
    on(accountSettingsActions.updateUserUsername, (state) => ({
      ...state,
      updateUsernameStatus: 'loading' as const,
    })),
    on(accountSettingsActions.updateUserUsernameSuccess, (state) => ({
      ...state,
      updateUsernameStatus: 'success' as const,
      hasUpdateUsernameError: null,
    })),
    on(accountSettingsActions.updateUserUsernameFailure, (state, action) => ({
      ...state,
      updateUsernameStatus: 'error' as const,
      hasUpdateUsernameError: action.error,
    })),
    on(accountSettingsActions.updateUserPassword, (state) => ({
      ...state,
      updatePasswordStatus: 'loading' as const,
    })),
    on(accountSettingsActions.updateUserPasswordSuccess, (state) => ({
      ...state,
      updatePasswordStatus: 'success' as const,
      hasUpdatePasswordError: null,
    })),
    on(accountSettingsActions.updateUserPasswordFailure, (state, action) => ({
      ...state,
      updatePasswordStatus: 'error' as const,
      hasUpdatePasswordError: action.error,
    })),
    on(accountSettingsActions.deleteAccount, (state) => ({
      ...state,
      deleteAccountStatus: 'loading' as const,
    })),
    on(accountSettingsActions.deleteAccountSuccess, (state) => ({
      ...state,
      deleteAccountStatus: 'success' as const,
      hasDeleteAccountError: null,
    })),
    on(accountSettingsActions.deleteAccountFailure, (state, action) => ({
      ...state,
      deleteAccountStatus: 'error' as const,
      hasDeleteAccountError: action.error,
    })),
    on(accountSettingsActions.resetStateOnDestroy, () => ({
      ...initialState,
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
    selectUpdateEmailSuccess: createSelector(
      selectUpdateEmailStatus,
      (updateEmailStatus) => updateEmailStatus === 'success',
    ),
    selectIsUpdatingUsername: createSelector(
      selectUpdateUsernameStatus,
      (updateUsernameStatus) => updateUsernameStatus === 'loading',
    ),
    selectUpdateUsernameSuccess: createSelector(
      selectUpdateUsernameStatus,
      (updateUsernameStatus) => updateUsernameStatus === 'success',
    ),
    selectIsUpdatingPassword: createSelector(
      selectUpdatePasswordStatus,
      (updatePasswordStatus) => updatePasswordStatus === 'loading',
    ),
    selectUpdatePasswordSuccess: createSelector(
      selectUpdatePasswordStatus,
      (updatePasswordStatus) => updatePasswordStatus === 'success',
    ),
    selectIsDeletingAccount: createSelector(
      selectDeleteAccountStatus,
      (deleteAccountStatus) => deleteAccountStatus === 'loading',
    ),
    selectDeleteAccountSuccess: createSelector(
      selectDeleteAccountStatus,
      (deleteAccountStatus) => deleteAccountStatus === 'success',
    ),
  }),
});

export const {
  name: accountSettingsFeatureKey,
  reducer: accountSettingsReducer,
  selectIsUpdatingEmail,
  selectUpdateEmailSuccess,
  selectHasUpdateEmailError,
  selectIsUpdatingUsername,
  selectUpdateUsernameSuccess,
  selectHasUpdateUsernameError,
  selectIsUpdatingPassword,
  selectUpdatePasswordSuccess,
  selectHasUpdatePasswordError,
  selectIsDeletingAccount,
  selectDeleteAccountSuccess,
  selectHasDeleteAccountError,
} = accountSettingsFeature;
