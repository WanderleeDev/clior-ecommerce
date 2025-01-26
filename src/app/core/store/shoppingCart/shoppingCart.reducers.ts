import { createReducer, on } from '@ngrx/store';
import { ShoppingCartState } from '../models/ShoppingCart.model';
import { SHOPPING_CART_ACTIONS } from './shoppingCart.actions';
import { ShoppingCartManager } from './static-class/shopping-cart-manager';

const initialState: ShoppingCartState = {
  products: [],
};

export const SHOPPING_CART_REDUCER = createReducer(
  initialState,
  on(
    SHOPPING_CART_ACTIONS.addProduct,
    (state, { product }): ShoppingCartState =>
      ShoppingCartManager.addProductToCart(state, product),
  ),
  on(
    SHOPPING_CART_ACTIONS.removeProduct,
    (state, { id }): ShoppingCartState =>
      ShoppingCartManager.removeProductFromCart(state, id),
  ),
  on(
    SHOPPING_CART_ACTIONS.clearShoppingCart,
    (): ShoppingCartState => ShoppingCartManager.clearShoppingCart(),
  ),
);
