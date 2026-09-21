import { Injectable } from '@angular/core';
import { map, type Observable, switchMap } from 'rxjs';
import { ViewProductsUsecase } from '../domain/ports/in/view-products.usecase';
import { ProductRepositoryPort } from '../domain/ports/out/product-repository.port';
import { ProductDomainService } from '../domain/services/product-domain.service';
import type { Product } from '../domain/models/product.model';
import type { Review } from '../domain/models/product.model';
import type { ProductListView, ProductView } from './product-view.model';

@Injectable()
export class ViewProductsUseCase extends ViewProductsUsecase {
  constructor(
    private readonly repo: ProductRepositoryPort,
    private readonly dom: ProductDomainService,
  ) {
    super();
  }

  view(id: string): Observable<ProductView> {
    return this.repo.getById(id).pipe(
      switchMap((p) =>
        this.repo.getRelated(p.id).pipe(map((rel) => this.toProductView(p, rel))),
      ),
    );
  }

  list(): Observable<ProductListView> {
    return this.repo.getAll().pipe(
      map((products) => ({
        products,
        categories: [],
        brands: [],
        total: products.length,
      })),
    );
  }

  reviews(id: string): Observable<Review[]> {
    return this.repo.getReviews(id);
  }

  private toProductView(product: Product, related: Product[]): ProductView {
    const thumbs = related.slice(0, 3).map((r) => r.image);
    return {
      product,
      related,
      thumbs,
      showDiscount: this.dom.hasDiscount(product),
      savings: this.dom.savings(product),
      ctaEnabled: this.dom.isAvailable(product),
    };
  }
}
