import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordRecoveryActions } from './password-recovery.actions';

type PasswordRecoveryState = {
  forgotPasswordStatus: 'pending' | 'loading' | 'error' | 'success';
  hasForgotPasswordError: HttpErrorResponse | null;
};

const initialState: PasswordRecoveryState = {
  forgotPasswordStatus: 'pending',
  hasForgotPasswordError: null,
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
  ),
  extraSelectors: ({ selectForgotPasswordStatus }) => ({
    selectForgetPasswordLoading: createSelector(
      selectForgotPasswordStatus,
      (forgotPasswordStatus) => forgotPasswordStatus === 'loading',
    ),
  }),
});

export const {
  name: passwordRecoveryFeatureKey,
  reducer: passwordRecoveryReducer,
  selectHasForgotPasswordError,
  selectForgetPasswordLoading,
} = passwordRecoveryFeature;
