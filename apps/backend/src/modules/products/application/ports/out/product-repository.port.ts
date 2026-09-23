import type { CreateProductInput, ListProductsQuery, Page, UpdateProductInput } from '../../types/product.types';
import type { Product } from '../../../domain/models/product';

export abstract class ProductRepositoryPort {
  abstract findPage(query: ListProductsQuery): Promise<Page<Product>>;
  abstract findOne(id: string): Promise<Product | null>;
  abstract create(input: CreateProductInput): Promise<Product>;
  abstract update(id: string, input: UpdateProductInput): Promise<Product | null>;
  abstract remove(id: string): Promise<boolean>;
}
