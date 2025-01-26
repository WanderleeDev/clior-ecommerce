import { createFeature, createSelector } from '@ngrx/store';
import { SHOPPING_CART_REDUCER } from './shoppingCart.reducers';
import { ShoppingCartManager } from './static-class/shopping-cart-manager';

export const SHOPPING_CART_FEATURE_KEY = 'shoppingCart';

export const SHOPPING_CART_FEATURE = createFeature({
  name: SHOPPING_CART_FEATURE_KEY,
  reducer: SHOPPING_CART_REDUCER,
  extraSelectors: ({ selectProducts }) => ({
    totalPrice: createSelector(selectProducts, (products) =>
      ShoppingCartManager.getTotalPrice(products),
    ),
    totalProducts: createSelector(selectProducts, (products) =>
      ShoppingCartManager.getTotalItems(products),
    ),
  }),
});

export const {
  name,
  reducer,
  selectShoppingCartState,
  selectProducts,
  totalPrice,
  totalProducts,
} = SHOPPING_CART_FEATURE;
