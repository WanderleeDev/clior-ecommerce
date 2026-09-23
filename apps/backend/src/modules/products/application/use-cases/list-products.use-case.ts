import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../ports/out/product-repository.port';
import { ListProductsPort } from '../ports/in/list-products.port';
import type { ListProductsQuery, PaginatedProducts } from '../types/product.types';

@Injectable()
export class ListProductsUseCase extends ListProductsPort {
  constructor(private readonly repository: ProductRepositoryPort) {
    super();
  }

  async execute(query: ListProductsQuery): Promise<PaginatedProducts> {
    return this.repository.findPage(query);
  }
}
