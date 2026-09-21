import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import type { Product } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-purchase',
  standalone: true,
  imports: [CurrencyPipe, NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
      <p class="flex items-baseline gap-3">
        <span class="font-display text-3xl font-extrabold">{{
          product().price | currency: 'PEN' : 'S/ ' : '1.2-2'
        }}</span>
        @if (product().oldPrice) {
          <s class="text-lg text-muted">{{
            product().oldPrice | currency: 'PEN' : 'S/ ' : '1.2-2'
          }}</s>
        }
      </p>
      <p class="mt-1 text-sm text-muted">
        ★ {{ product().rating }} · {{ product().reviews }} reseñas
      </p>

      <div class="mt-5 flex items-center gap-4">
        <span class="inline-flex items-center gap-4 rounded-full border border-line px-5 py-2" aria-label="Cantidad">
          <button
            type="button"
            (click)="dec()"
            aria-label="Quitar uno"
            class="text-lg leading-none"
          >
            −
          </button>
          <span class="min-w-6 text-center font-medium">{{ qty() }}</span>
          <button
            type="button"
            (click)="inc()"
            aria-label="Agregar uno"
            class="text-lg leading-none"
          >
            +
          </button>
        </span>
        <span class="text-sm text-muted">12 und. disponibles</span>
      </div>

      <div class="mt-5 flex flex-col gap-3">
        <a
          href="/carrito"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink"
        >
          <ngx-iconify icon="noto:shopping-cart" [size]="20" />
          Añadir al carrito
        </a>
        <a
          href="/carrito"
          class="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3.5 font-bold transition-colors motion-reduce:transition-none hover:border-accent hover:text-accent"
        >
          Comprar ahora
        </a>
      </div>

      <div class="mt-5 space-y-2 border-t border-line pt-4 text-sm text-muted">
        <p class="inline-flex items-center gap-2">
          <ngx-iconify icon="lucide:truck" [size]="16" />
          Envío 24/48h · gratis desde S/ 99
        </p>
        <p class="inline-flex items-center gap-2">
          <ngx-iconify icon="lucide:rotate-ccw" [size]="16" />
          Devolución 15 días
        </p>
        <p class="inline-flex items-center gap-2">
          <ngx-iconify icon="lucide:shield-check" [size]="16" />
          Compra 100% protegida
        </p>
      </div>
    </div>
  `,
})
export class ProductPurchase {
  readonly product = input.required<Product>();
  protected readonly qty = signal(1);

  protected inc(): void {
    this.qty.update((v) => Math.min(v + 1, 12));
  }

  protected dec(): void {
    this.qty.update((v) => Math.max(v - 1, 1));
  }
}
