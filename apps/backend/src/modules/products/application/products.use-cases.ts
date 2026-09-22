import { Injectable } from '@nestjs/common';
import {
  Product,
  ProductNotFoundError,
  ProductRepositoryPort,
} from '../domain/product';

@Injectable()
export class ListProductsUseCase {
  constructor(
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(): Promise<Product[]> {
    return this.repository.findAll();
  }
}

@Injectable()
export class GetProductUseCase {
  constructor(
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }
}
