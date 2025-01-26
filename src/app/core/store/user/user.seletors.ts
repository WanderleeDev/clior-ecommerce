import { createFeature } from '@ngrx/store';
import { USER_REDUCER } from './user.reducers';

export const USER_FEATURE_KEY = 'user';

export const USER_FEATURE = createFeature({
  name: USER_FEATURE_KEY,
  reducer: USER_REDUCER,
});

export const { name, reducer, selectUserState, selectRole } = USER_FEATURE;
