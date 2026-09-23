import type { Product } from '../../../domain/models/product';

export abstract class GetProductPort {
  abstract execute(id: string): Promise<Product>;
}
