import { createAction, props } from '@ngrx/store';
import { IProductDto } from '../../../pages/home/interfaces/IProduct.interface';
import { UpdateAction } from './shopping-cart-reducers';

const addProduct = createAction(
  '[Products Page] Add Product',
  props<{ product: IProductDto }>()
);

const removeProduct = createAction(
  '[Products Page] Remove Product',
  props<{ productId: number }>()
);

const updateProduct = createAction(
  '[Shopping Cart Section] Update quantity product',
  props<{ productId: number, action: UpdateAction }>()
);

const clearShoppingCart = createAction(
  '[Shopping Cart Section] Clean shopping cart list'
);

const SHOPPING_CART_ACTIONS = {
  addProduct,
  removeProduct,
  updateProduct,
  clearShoppingCart,
};

export default SHOPPING_CART_ACTIONS;
