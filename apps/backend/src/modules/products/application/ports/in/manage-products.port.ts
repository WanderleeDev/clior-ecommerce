import type { UpdateProductInput } from '../../types/product.types';
import type { Product } from '../../../domain/models/product';

export abstract class UpdateProductPort {
  abstract execute(id: string, input: UpdateProductInput): Promise<Product>;
}

export abstract class UpdateStockPort {
  abstract execute(id: string, delta: number): Promise<Product>;
}

export abstract class DeleteProductPort {
  abstract execute(id: string): Promise<void>;
}
