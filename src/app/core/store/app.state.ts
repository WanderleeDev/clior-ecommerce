import { ActionReducerMap } from '@ngrx/store';
import { AUTH_REDUCER } from './auth/auth.reducers';
import { SHOPPING_CART_REDUCER } from '../../modules/shopping-cart/store/shoppingCart.reducers';
import { AppState } from './models/App.model';
import * as authEffects from './auth/auth.effects';
import * as sharedEffects from './shared/shared.effects';
import { USER_REDUCER } from './user/user.reducers';

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: AUTH_REDUCER,
  shoppingCart: SHOPPING_CART_REDUCER,
  user: USER_REDUCER,
};

export const ROOT_EFFECTS = [authEffects, sharedEffects];
