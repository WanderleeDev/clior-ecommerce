import { ActionReducerMap } from '@ngrx/store';
import { AUTH_REDUCER } from './auth/auth.reducers';
import { AppState } from './models/App.model';
import * as authEffects from './auth/auth.effects';
import * as sharedEffects from './shared/shared.effects';

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: AUTH_REDUCER,
};

export const ROOT_EFFECTS = [authEffects, sharedEffects];
