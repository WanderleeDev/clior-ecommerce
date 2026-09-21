import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxIconify } from 'ngx-iconify-stack';
import { ProductGallery } from '../../components/product-gallery/product-gallery';
import { ProductPurchase } from '../../components/product-purchase/product-purchase';
import { ProductInfo } from '../../components/product-info/product-info';
import { ProductReviews } from '../../components/product-reviews/product-reviews';
import { ProductRail } from '../../components/product-rail/product-rail';
import { ViewProductsUsecase } from '../../../domain/ports/in/view-products.usecase';
import type { ProductView } from '../../../application/product-view.model';
import type { Review } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgxIconify, ProductGallery, ProductPurchase, ProductInfo, ProductReviews, ProductRail],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (view()) {
      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav aria-label="Ruta" class="text-sm text-muted">
          <a href="/" class="hover:text-accent">Inicio</a>
          <span aria-hidden="true"> / </span>
          <a href="/catalogo" class="hover:text-accent">Catálogo</a>
          <span aria-hidden="true"> / </span>
          <span class="text-foreground">{{ view()?.product?.name }}</span>
        </nav>

        <div class="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr_0.8fr]">
          <app-product-gallery
            [images]="gallery()"
            [alt]="view()?.product?.imageAlt ?? ''"
          />

          <div>
            <p class="text-sm uppercase tracking-wide text-muted">
              {{ view()?.product?.brand }}
            </p>
            <h1 class="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              {{ view()?.product?.name }}
            </h1>
            <p class="mt-4 text-muted">
              Alimento premium con proteína real como primer ingrediente. Ideal
              para adultos de todas las razas. Bolsa resellable que mantiene la
              frescura hasta 6 semanas.
            </p>

            <div class="mt-8">
              <app-product-info [sections]="accordion" />
            </div>
          </div>

          <app-product-purchase [product]="view()!.product" />
        </div>

        <div class="mt-16">
          <app-product-reviews [reviews]="reviews()" />
        </div>

        <div class="mt-16">
          <app-product-rail
            title="También te puede gustar"
            [products]="view()?.related ?? []"
          />
        </div>
      </section>
    } @else {
      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p class="flex items-center gap-2 text-muted">
          <ngx-iconify icon="lucide:search" [size]="18" />
          Cargando producto…
        </p>
      </section>
    }
  `,
})
export class ProductDetailView {
  private readonly viewProducts = inject(ViewProductsUsecase);
  protected readonly view = signal<ProductView | undefined>(undefined);
  protected readonly reviews = signal<Review[]>([]);

  protected readonly accordion = [
    {
      title: 'Detalles del producto',
      text: 'Proteína 26%, grasa 14%, fibra 4%. Sin colorantes artificiales. Peso neto 15 kg. Fabricado con ingredientes seleccionados.',
    },
    {
      title: 'Envío y entrega',
      text: 'Despacho el mismo día en Lima (pedidos antes de las 3pm) y 48–72h a provincias. Envío gratis desde S/ 99.',
    },
    {
      title: 'Devoluciones',
      text: '15 días para cambios en productos sellados y 7 días en alimento abierto si tu mascota lo rechaza.',
    },
  ];

  protected gallery = computed(() => {
    const product = this.view()?.product;
    if (!product) return [];
    return [product.image, ...(this.view()?.thumbs ?? [])];
  });

  constructor() {
    const id = inject(ActivatedRoute).snapshot.params['id'] as string;
    this.viewProducts
      .view(id)
      .pipe()
      .subscribe((v) => this.view.set(v));
    this.viewProducts
      .reviews(id)
      .pipe()
      .subscribe((r) => this.reviews.set(r));
  }
}
