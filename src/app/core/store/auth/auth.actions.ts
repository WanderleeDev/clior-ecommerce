import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthLoginSuccess } from '../../../pages/auth/interfaces/authResponse.interface';

export const AUTH_ACTIONS = createActionGroup({
  source: 'Auth',
  events: {
    login: props<{ email: string; password: string }>(),
    loginSuccess: props<{ credentials: AuthLoginSuccess }>(),
    loginFailure: props<{ error: string[] }>(),
    logout: emptyProps(),
    authError: props<{ error: string }>(),
    clearError: emptyProps(),
  },
});
