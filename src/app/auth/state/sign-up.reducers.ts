import { HttpErrorResponse } from '@angular/common/http';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { signUpActions } from './sign-up.actions';

type SignUpState = {
  signUpStatus: 'pending' | 'loading' | 'error' | 'success';
  hasSignUpError: HttpErrorResponse | null;
};

const initialState: SignUpState = {
  signUpStatus: 'pending',
  hasSignUpError: null,
};

const signUpFeature = createFeature({
  name: 'Sign Up',
  reducer: createReducer(
    initialState,
    on(signUpActions.signUp, (state) => ({
      ...state,
      signUpStatus: 'loading' as const,
    })),
    on(signUpActions.signUpSuccess, (state) => ({
      ...state,
      signUpStatus: 'success' as const,
      hasSignUpError: null,
    })),
    on(signUpActions.signUpFailure, (state, action) => ({
      ...state,
      signUpStatus: 'error' as const,
      hasSignUpError: action.error,
    })),
    on(signUpActions.resetStateOnDestroy, () => ({
      ...initialState,
    })),
  ),
  extraSelectors: ({ selectSignUpStatus }) => ({
    selectIsSigningUp: createSelector(
      selectSignUpStatus,
      (signUpStatus) => signUpStatus === 'loading',
    ),
    selectSignUpSuccess: createSelector(
      selectSignUpStatus,
      (signUpStatus) => signUpStatus === 'success',
    ),
  }),
});

export const {
  name: signUpFeatureKey,
  reducer: signUpReducer,
  selectHasSignUpError,
  selectIsSigningUp,
  selectSignUpSuccess,
} = signUpFeature;
