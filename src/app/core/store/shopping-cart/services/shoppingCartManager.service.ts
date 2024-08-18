import { Injectable } from '@angular/core';
import { IProductDto } from '../../../../pages/home/interfaces/IProduct.interface';
import {
  IUpdateParams,
  UpdateAction,
} from '../interfaces/IShoppingCart.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartManagerService {
  public removeProduct(
    products: IProductDto[],
    productId: number
  ): IProductDto[] {
    return products.filter((product) => product.id !== productId);
  }

  public addProduct(
    products: IProductDto[],
    product: IProductDto
  ): IProductDto[] {
    return [...products, product];
  }

  public updateProducts({
    products,
    productId,
    action,
  }: IUpdateParams): IProductDto[] {
    const existProduct = products.find((value) => value.id === productId);

    if (!existProduct || existProduct.quantity <= 1 || action in UpdateAction)
      return [];

    const quantityChange: number = action === UpdateAction.increment ? 1 : -1;

    const productUpdated: IProductDto = {
      ...existProduct,
      quantity: existProduct.quantity + quantityChange,
    };

    return [...products, productUpdated];
  }
}
