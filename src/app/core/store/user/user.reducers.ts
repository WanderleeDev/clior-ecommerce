import { createReducer, on } from '@ngrx/store';
import { UserState } from '../models/User.model';
import { USER_ACTIONS } from './user.actions';

const initialState: UserState = {
  id: '',
  firstName: '',
  lastName: '',
  age: 0,
  image: null,
  email: '',
  phone: '',
  role: 'guest',
  address: null,
  city: null,
  state: null,
  zip: null,
};

export const USER_REDUCER = createReducer(
  initialState,
  on(
    USER_ACTIONS.saveUser,
    (state, { user }): UserState => ({
      ...state,
      ...user,
    }),
  ),
  on(USER_ACTIONS.clearUser, (): UserState => ({ ...initialState })),
);
