import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../ports/out/product-repository.port';
import { CreateProductPort } from '../ports/in/create-product.port';
import type { CreateProductInput } from '../types/product.types';
import type { Product } from '../../domain/models/product';

@Injectable()
export class CreateProductUseCase extends CreateProductPort {
  constructor(private readonly repository: ProductRepositoryPort) {
    super();
  }

  async execute(input: CreateProductInput): Promise<Product> {
    return this.repository.create(input);
  }
}
