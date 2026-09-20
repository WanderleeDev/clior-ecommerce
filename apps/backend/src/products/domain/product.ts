export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
}

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product | undefined>;
}

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product ${id} not found`);
    this.name = 'ProductNotFoundError';
  }
}

export const PRODUCT_REPOSITORY_PORT = Symbol('ProductRepositoryPort');
