import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../models/Auth.model';
import { AUTH_ACTIONS } from './auth.actions';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  token: null,
  error: null,
  role: null,
};

export const AUTH_REDUCER = createReducer(
  initialState,
  on(
    AUTH_ACTIONS.login,
    (state): AuthState => ({ ...state, isLoading: true, error: null }),
  ),
  on(
    AUTH_ACTIONS.loginSuccess,
    (state, { credentials }): AuthState => ({
      ...state,
      ...credentials,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),
  ),
  on(
    AUTH_ACTIONS.loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      error,
      isLoading: false,
      isAuthenticated: false,
      token: null,
      role: null,
    }),
  ),
  on(AUTH_ACTIONS.logout, (): AuthState => ({ ...initialState })),
);
