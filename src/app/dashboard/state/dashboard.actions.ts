import { createActionGroup, emptyProps } from '@ngrx/store';

export const dashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'All Observables Loaded': emptyProps(),
  },
});
