import { Injectable } from '@nestjs/common';
import { Product, ProductRepositoryPort } from '../../../../domain/product';

@Injectable()
export class InMemoryProductRepository implements ProductRepositoryPort {
  private readonly products: Product[] = [
    {
      id: 'p1',
      name: 'Sample product',
      description: 'A sample product',
      priceCents: 1999,
    },
  ];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findOne(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }
}
