import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ShopFilters } from '../../components/shop-filters/shop-filters';
import { ProductCard } from '../../components/product-card/product-card';
import { ViewProductsUsecase } from '../../../domain/ports/in/view-products.usecase';
import type { ProductListView as CatalogData } from '../../../application/product-view.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ShopFilters, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside
          aria-label="Filtros de productos"
          class="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto"
        >
          <app-shop-filters />
        </aside>

        <div>
          @if (brand()) {
            <p class="mb-4 text-sm text-muted">
              Mostrando productos de <span class="font-bold text-foreground">{{ brand() }}</span>
              ·
              <a href="/catalogo" class="text-accent hover:underline">Ver todo</a>
            </p>
          }
          <div class="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
            @for (product of products(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          <div class="mt-12 rounded-3xl bg-brand-deep p-8 text-center text-white md:p-12">
            <h2 class="font-display text-2xl font-extrabold md:text-3xl">
              ¿Primera compra? Te regalamos el snack
            </h2>
            <p class="mx-auto mt-3 max-w-xl text-white/70">
              En pedidos desde S/ 99 el envío es gratis y sumas puntos Huella en
              cada compra.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProductListView {
  private readonly viewProducts = inject(ViewProductsUsecase);
  protected readonly view = signal<CatalogData | undefined>(undefined);
  protected readonly brand = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map((params) => params.get('marca'))),
    { initialValue: null as string | null },
  );
  protected readonly products = computed(() => {
    const products = this.view()?.products ?? [];
    const brand = this.brand()?.toLowerCase();
    if (!brand) return products;
    return products.filter((p) => p.brand.toLowerCase() === brand);
  });

  constructor() {
    this.viewProducts
      .list()
      .pipe()
      .subscribe((v) => this.view.set(v));
  }
}
