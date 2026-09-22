export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
}

export abstract class ProductRepositoryPort {
  abstract findAll(): Promise<Product[]>;
  abstract findOne(id: string): Promise<Product | null>;
}

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product ${id} not found`);
    this.name = 'ProductNotFoundError';
  }
}
