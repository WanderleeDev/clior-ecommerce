import { IProductDto } from "../../../../pages/home/interfaces/IProduct.interface";

export interface IUpdateParams {
  products: IProductDto[];
  productId: number;
  action: UpdateAction;
}

export enum UpdateAction {
  decrease,
  increment,
}

export enum ShoppingCartStatus {
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
  Empty = 'empty',
}
