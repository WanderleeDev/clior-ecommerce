import { Product } from './Product.model';

export interface ShoppingCartState {
  products: ProductShoppingCart[];
}

export interface Order {
  quantity: number;
  presentation: string;
  formulation: string;
  quantityPerPresentation: number;
}

export type ProductShoppingCart = ProductInfoBasic & Order;

export type ProductInfoBasic = Pick<
  Product,
  'id' | 'name' | 'price' | 'thumbnail'
>;
