import type { CreateProductInput } from '../../types/product.types';
import type { Product } from '../../../domain/models/product';

export abstract class CreateProductPort {
  abstract execute(input: CreateProductInput): Promise<Product>;
}
