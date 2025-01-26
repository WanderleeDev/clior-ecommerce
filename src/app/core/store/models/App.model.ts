import { AuthState } from './Auth.model';
import { ShoppingCartState } from './ShoppingCart.model';
import { UserState } from './User.model';

export interface AppState {
  auth: AuthState;
  shoppingCart: ShoppingCartState;
  user: UserState;
}
