import { Injectable, Inject } from '@nestjs/common';
import {
  Product,
  ProductNotFoundError,
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '../domain/product';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(): Promise<Product[]> {
    return this.repository.findAll();
  }
}

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
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
