import { createFeature, createReducer, on } from '@ngrx/store';
import { dashboardActions } from './dashboard.actions';

type DashboardState = {
  isLoading: boolean;
};

const initialState: DashboardState = {
  isLoading: true,
};

const dashboardFeature = createFeature({
  name: 'Dashboard',
  reducer: createReducer(
    initialState,
    on(dashboardActions.allObservablesLoaded, (state) => ({
      ...state,
      isLoading: false,
    })),
  ),
});

export const {
  name: dashboardFeatureKey,
  reducer: dashboardReducer,
  selectIsLoading,
} = dashboardFeature;
