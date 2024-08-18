import { createReducer, on } from '@ngrx/store';
import { IProductDto } from '../../../pages/home/interfaces/IProduct.interface';
import SHOPPING_CART_ACTIONS from './shopping-cart.actions';
import { ShoppingCartStatus } from './interfaces/IShoppingCart.interface';
import { ShoppingCartManagerService } from './services/shoppingCartManager.service';

export interface ShoppingCartState {
  products: readonly IProductDto[];
  status: ShoppingCartStatus;
}

const initialState: ShoppingCartState = {
  products: [],
  status: ShoppingCartStatus.Empty,
};

export const shoppingCartReducers = createReducer(
  initialState,
  on(
    SHOPPING_CART_ACTIONS.addProduct,
    (state, { product }): ShoppingCartState =>({...state,products: [...state.products, product]  })

  ),
  on(
    SHOPPING_CART_ACTIONS.removeProduct,
    (state, { productId }): ShoppingCartState => ({
      ...state,
      products: state.products.filter((product) => product.id !== productId),
    })
  ),
  on(
    SHOPPING_CART_ACTIONS.clearShoppingCart,
    (state): ShoppingCartState => ({ ...state, products: [] })
  ),
  on(
    SHOPPING_CART_ACTIONS.updateProduct,
    (state, { productId, action }): ShoppingCartState => {
      const newData = ShoppingCartManagerService.updateProduct(
        state.products,
        productId,
        action
      );
    })
  )
);
