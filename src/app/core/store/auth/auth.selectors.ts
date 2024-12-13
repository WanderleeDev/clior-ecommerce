import { createFeature } from '@ngrx/store';
import { AUTH_REDUCER } from './auth.reducers';

export const AUTH_FEATURE_KEY = 'auth';

export const AUTH_FEATURE = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: AUTH_REDUCER,
});

export const {
  name,
  reducer,
  selectAuthState,
  selectIsAuthenticated,
  selectIsLoading,
  selectToken,
  selectError,
  selectRole,
} = AUTH_FEATURE;
