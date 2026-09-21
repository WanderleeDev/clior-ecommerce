import { Injectable, signal } from '@angular/core';
import type { Product } from '../../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly products = signal<Product[]>([]);
  readonly all = this.products.asReadonly();

  set(products: Product[]): void {
    this.products.set(products);
  }

  getById(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }
}
