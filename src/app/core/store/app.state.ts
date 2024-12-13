import { ActionReducerMap } from '@ngrx/store';
import { AUTH_REDUCER } from './auth/auth.reducers';
import { AppState } from './models/App.model';

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: AUTH_REDUCER,
};

export const ROOT_EFFECTS = [];
