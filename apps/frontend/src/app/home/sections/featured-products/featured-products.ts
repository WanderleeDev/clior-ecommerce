import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CtaButton } from '../../../shared/components/cta-button';
import { ProductCard } from '../../../products/presentation/components/product-card/product-card';
import { PRODUCTS } from '../../../products/infrastructure/adapters/mock-product.adapter';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CtaButton, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-label="Productos destacados">
      <h2 class="mt-3 max-w-2xl font-display text-3xl font-extrabold md:text-4xl">
        Productos <span class="text-muted">que vuelan.</span>
      </h2>
      <div class="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
        @for (product of featured; track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
      <div class="mt-8 text-center">
        <app-cta-button
          label="Ver catálogo completo"
          href="/catalogo"
          variant="secondary"
        />
      </div>
    </section>
  `,
})
export class FeaturedProducts {
  protected readonly featured = PRODUCTS.slice(0, 8);
}
