import { createFeature, createSelector } from '@ngrx/store';
import { SHOPPING_CART_REDUCER } from './shoppingCart.reducers';

export const SHOPPING_CART_FEATURE_KEY = 'shoppingCart';

export const SHOPPING_CART_FEATURE = createFeature({
  name: SHOPPING_CART_FEATURE_KEY,
  reducer: SHOPPING_CART_REDUCER,
  extraSelectors: ({ selectProducts }) => ({
    selectTotalPriceProducts: createSelector(selectProducts, (products) =>
      products?.reduce((prev, acc) => prev + acc.price * acc.quantity, 0),
    ),
    selectQuantityProducts: createSelector(selectProducts, (products) =>
      products?.reduce((prev, acc) => prev + acc.quantity, 0),
    ),
  }),
});

export const {
  selectProducts,
  selectQuantityProducts,
  selectTotalPriceProducts,
} = SHOPPING_CART_FEATURE;
