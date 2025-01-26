import { createActionGroup, props } from '@ngrx/store';

export const SHARED_ACTIONS = createActionGroup({
  source: 'Shared',
  events: {
    redirectTo: props<{ url: string; params?: string }>(),
    showToast: props<{ message: string }>(),
    handleError: props<{ error: unknown }>(),
  },
});
