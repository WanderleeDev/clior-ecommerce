import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProductShoppingCart } from '../models/ShoppingCart.model';

export const SHOPPING_CART_ACTIONS = createActionGroup({
  source: 'ShoppingCart',
  events: {
    addProduct: props<{ product: ProductShoppingCart }>(),
    removeProduct: props<{ id: string }>(),
    clearShoppingCart: emptyProps(),
  },
});
