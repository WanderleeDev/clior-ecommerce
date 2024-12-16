import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../models/Auth.model';
import { AUTH_ACTIONS } from './auth.actions';

const initialState: AuthState = {
  isAuthenticated: true,
  isLoading: false,
  token: null,
  error: [],
  role: null,
};

export const AUTH_REDUCER = createReducer(
  initialState,
  on(
    AUTH_ACTIONS.login,
    (state): AuthState => ({ ...state, isLoading: true, error: [] }),
  ),
  on(
    AUTH_ACTIONS.loginSuccess,
    (state, { credentials }): AuthState => ({
      ...state,
      ...credentials,
      isAuthenticated: true,
      isLoading: false,
      error: [],
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
  on(AUTH_ACTIONS.clearError, (state): AuthState => ({ ...state, error: [] })),
  on(AUTH_ACTIONS.logout, (): AuthState => ({ ...initialState })),
);
