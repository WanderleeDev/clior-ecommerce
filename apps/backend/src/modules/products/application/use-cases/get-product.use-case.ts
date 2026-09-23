import { Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import { ProductRepositoryPort } from '../ports/out/product-repository.port';
import { GetProductPort } from '../ports/in/get-product.port';
import type { Product } from '../../domain/models/product';

@Injectable()
export class GetProductUseCase extends GetProductPort {
  constructor(private readonly repository: ProductRepositoryPort) {
    super();
  }

  async execute(id: string): Promise<Product> {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }
}
