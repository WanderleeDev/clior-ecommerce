import { AuthState } from './Auth.model';
import { ShoppingCartState } from '../../../modules/shopping-cart/store/models/ShoppinCart.state';
import { UserState } from './User.model';

export interface AppState {
  auth: AuthState;
  shoppingCart: ShoppingCartState;
  user: UserState;
}
