import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import type { Product } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-rail',
  standalone: true,
  imports: [ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-rail.html',
  styleUrl: './product-rail.css',
})
export class ProductRail {
  readonly title = input.required<string>();
  readonly products = input.required<Product[]>();
}
