import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { HttpErrorResponse } from '@angular/common/http';

type AuthState = {
  isLoggingIn: boolean;
  hasLoginError: HttpErrorResponse | null;
  hasRefreshTokenError: HttpErrorResponse | null;
  userId: string | null;
  userRole: string | null;
  loginStatus: 'pending' | 'loading' | 'error' | 'success';
};

const initialState: AuthState = {
  isLoggingIn: false,
  hasLoginError: null,
  hasRefreshTokenError: null,
  userId: null,
  userRole: null,
  loginStatus: 'pending',
};

const authFeature = createFeature({
  name: 'Auth',
  reducer: createReducer(
    initialState,
    on(authActions.login, (state) => ({
      ...state,
      isLoggingIn: true,
      hasLoginError: null,
      loginStatus: 'loading' as const,
    })),
    on(authActions.loginSuccess, (state) => ({
      ...state,
      isLoggingIn: false,
      hasLoginError: null,
      loginStatus: 'success' as const,
    })),
    on(authActions.loginFailure, (state, action) => ({
      ...state,
      isLoggingIn: false,
      hasLoginError: action.error,
      loginStatus: 'error' as const,
    })),
    on(authActions.logout, () => ({
      ...initialState,
    })),
    on(authActions.refreshTokenSuccess, (state) => ({
      ...state,
      hasRefreshTokenError: null,
      loginStatus: 'success' as const,
    })),
    on(authActions.refreshTokenFailure, (state, action) => ({
      ...state,
      hasRefreshTokenError: action.error,
      userId: null,
      userRole: null,
      loginStatus: 'error' as const,
    })),
    on(authActions.setUserId, (state, action) => ({
      ...state,
      userId: action.userId,
    })),
    on(authActions.setUserRole, (state, action) => ({
      ...state,
      userRole: action.role,
    })),
  ),
  extraSelectors: ({ selectUserRole }) => ({
    selectIsCurrentUserAdmin: createSelector(
      selectUserRole,
      (userRole) => userRole === 'admin',
    ),
  }),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsLoggingIn,
  selectHasLoginError,
  selectIsCurrentUserAdmin,
  selectLoginStatus,
} = authFeature;
