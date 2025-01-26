import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserState } from '../models/User.model';

export const USER_ACTIONS = createActionGroup({
  source: 'User',
  events: {
    saveUser: props<{ user: Partial<UserState> }>(),
    clearUser: emptyProps(),
  },
});
