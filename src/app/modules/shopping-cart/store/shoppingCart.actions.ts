import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProductShoppingCart } from './models/ProductShoppingCart.model';

export const SHOPPING_CART_ACTIONS = createActionGroup({
  source: 'ShoppingCart',
  events: {
    addProduct: props<{ product: ProductShoppingCart }>(),
    decreaseProductQuantity: props<{ id: string }>(),
    incrementProductQuantity: props<{ id: string }>(),
    removeProduct: props<{ id: string }>(),
    clearShoppingCart: emptyProps(),
  },
});
