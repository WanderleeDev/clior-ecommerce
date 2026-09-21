
import type { Product } from '../models/product.model';

export class ProductDomainService {
  hasDiscount(product: Product): boolean {
    return product.oldPrice != null && product.oldPrice > product.price;
  }

  savings(product: Product): number | null {
    return this.hasDiscount(product) ? (product.oldPrice as number) - product.price : null;
  }

  isAvailable(product: Product): boolean {
    return product.stock == null || product.stock > 0;
  }
}
