import { createReducer, on } from '@ngrx/store';
import { ShoppingCartState } from './models/ShoppingCart.state';
import { SHOPPING_CART_ACTIONS } from './shoppingCart.actions';

const initialState: ShoppingCartState = {
  products: [],
};

export const SHOPPING_CART_REDUCER = createReducer(
  initialState,
  on(
    SHOPPING_CART_ACTIONS.addProduct,
    (state, { product }): ShoppingCartState => {
      const hasProduct = state.products.find((p) => p.id === product.id);
      if (!hasProduct) {
        return { products: [...state.products, product] };
      }

      return {
        products: state.products.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      };
    },
  ),
  on(
    SHOPPING_CART_ACTIONS.removeProduct,
    (state, { id }): ShoppingCartState => ({
      products: state.products.filter((p) => p.id !== id),
    }),
  ),
  on(
    SHOPPING_CART_ACTIONS.decreaseProductQuantity,
    (state, { id }): ShoppingCartState => {
      const currentProduct = state.products.find((p) => p.id === id);

      if (!currentProduct) return state;

      if (currentProduct.quantity === 1) {
        return { products: state.products.filter((p) => p.id !== id) };
      }

      return {
        products: state.products.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p,
        ),
      };
    },
  ),
  on(
    SHOPPING_CART_ACTIONS.incrementProductQuantity,
    (state, { id }): ShoppingCartState => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
      ),
    }),
  ),
  on(
    SHOPPING_CART_ACTIONS.clearShoppingCart,
    (): ShoppingCartState => ({ products: [] }),
  ),
);
