import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import { ProductRepositoryPort } from '../ports/out/product-repository.port';
import { DeleteProductPort, UpdateProductPort, UpdateStockPort } from '../ports/in/manage-products.port';
import type { UpdateProductInput } from '../types/product.types';
import type { Product } from '../../domain/models/product';

@Injectable()
export class UpdateProductUseCase extends UpdateProductPort {
  constructor(private readonly repository: ProductRepositoryPort) {
    super();
  }

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.repository.update(id, input);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }
}

@Injectable()
export class UpdateStockUseCase extends UpdateStockPort {
  constructor(private readonly repository: ProductRepositoryPort) {
    super();
  }

  async execute(id: string, delta: number): Promise<Product> {
    const current = await this.repository.findOne(id);
    if (!current) {
      throw new ProductNotFoundError(id);
    }
    const stock = (current.stock ?? 0) + delta;
    if (stock < 0) {
      throw new BadRequestException('Insufficient stock');
    }
    const product = await this.repository.update(id, { stock });
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }
}

@Injectable()
export class DeleteProductUseCase extends DeleteProductPort {
  constructor(private readonly repository: ProductRepositoryPort) {
    super();
  }

  async execute(id: string): Promise<void> {
    const removed = await this.repository.remove(id);
    if (!removed) {
      throw new ProductNotFoundError(id);
    }
  }
}
