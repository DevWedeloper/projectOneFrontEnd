import { HttpErrorResponse } from '@angular/common/http';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { passwordRecoveryActions } from './password-recovery.actions';

type Status = 'pending' | 'loading' | 'error' | 'success';

type PasswordRecoveryState = {
  forgotPasswordStatus: Status;
  hasForgotPasswordError: HttpErrorResponse | null;
  resetPasswordStatus: Status;
  hasResetPasswordError: HttpErrorResponse | null;
};

const initialState: PasswordRecoveryState = {
  forgotPasswordStatus: 'pending',
  hasForgotPasswordError: null,
  resetPasswordStatus: 'pending',
  hasResetPasswordError: null,
};

const passwordRecoveryFeature = createFeature({
  name: 'Password Recovery',
  reducer: createReducer(
    initialState,
    on(passwordRecoveryActions.forgotPassword, (state) => ({
      ...state,
      forgotPasswordStatus: 'loading' as const,
    })),
    on(passwordRecoveryActions.forgotPasswordSuccess, (state) => ({
      ...state,
      forgotPasswordStatus: 'success' as const,
      hasForgotPasswordError: null,
    })),
    on(passwordRecoveryActions.forgotPasswordFailure, (state, action) => ({
      ...state,
      forgotPasswordStatus: 'error' as const,
      hasForgotPasswordError: action.error,
    })),
    on(passwordRecoveryActions.resetPassword, (state) => ({
      ...state,
      resetPasswordStatus: 'loading' as const,
    })),
    on(passwordRecoveryActions.resetPasswordSuccess, (state) => ({
      ...state,
      resetPasswordStatus: 'success' as const,
      hasResetPasswordError: null,
    })),
    on(passwordRecoveryActions.resetPasswordFailure, (state, action) => ({
      ...state,
      resetPasswordStatus: 'error' as const,
      hasResetPasswordError: action.error,
    })),
    on(passwordRecoveryActions.resetStateOnDestroy, () => ({
      ...initialState,
    })),
  ),
  extraSelectors: ({
    selectForgotPasswordStatus,
    selectResetPasswordStatus,
  }) => ({
    selectForgetPasswordLoading: createSelector(
      selectForgotPasswordStatus,
      (forgotPasswordStatus) => forgotPasswordStatus === 'loading',
    ),
    selectIsResettingPassword: createSelector(
      selectResetPasswordStatus,
      (resetPasswordStatus) => resetPasswordStatus === 'loading',
    ),
    selectResetPasswordSuccess: createSelector(
      selectResetPasswordStatus,
      (resetPasswordStatus) => resetPasswordStatus === 'success',
    ),
  }),
});

export const {
  name: passwordRecoveryFeatureKey,
  reducer: passwordRecoveryReducer,
  selectHasForgotPasswordError,
  selectHasResetPasswordError,
  selectForgetPasswordLoading,
  selectIsResettingPassword,
  selectResetPasswordSuccess,
} = passwordRecoveryFeature;
