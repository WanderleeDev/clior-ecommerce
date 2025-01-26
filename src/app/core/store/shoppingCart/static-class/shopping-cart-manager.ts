import {
  ShoppingCartState,
  ProductShoppingCart,
} from '../../models/ShoppingCart.model';

export class ShoppingCartManager {
  static addProductToCart(
    state: ShoppingCartState,
    product: ProductShoppingCart,
  ) {
    if (!this.filterOneProductById(state.products, product.id)) {
      return { products: [...state.products, product] };
    }

    return {
      products: state.products.map((p) => {
        if (p.id !== product.id) return p;
        return { ...p, quantity: p.quantity + 1 };
      }),
    };
  }

  static removeProductFromCart(state: ShoppingCartState, id: string) {
    if (!this.filterOneProductById(state.products, id)) {
      return state;
    }

    return {
      products: state.products.filter((p) => p.id !== id),
    };
  }

  static getTotalPrice(products: ProductShoppingCart[]): number {
    return products.reduce((acc, prev) => acc + prev.price * prev.quantity, 0);
  }

  static clearShoppingCart() {
    return { products: [] };
  }

  static getTotalItems(products: ProductShoppingCart[]): number {
    return products.reduce((acc, prev) => acc + prev.quantity, 0);
  }

  private static filterOneProductById(
    products: ProductShoppingCart[],
    id: string,
  ): boolean {
    return products.findIndex((p) => p.id === id) !== -1;
  }
}
