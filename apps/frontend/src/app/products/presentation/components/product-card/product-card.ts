import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import type { Product } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <article
      class="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div class="relative aspect-square overflow-hidden bg-surface">
        <img
          [src]="product().image"
          [alt]="product().imageAlt"
          loading="lazy"
          width="600"
          height="600"
          class="h-full w-full object-cover"
        />
        @if (product().badge) {
          <span
            class="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink"
          >
            {{ product().badge }}
          </span>
        }
      </div>
      <div class="flex flex-1 flex-col p-4">
        <p class="text-xs uppercase tracking-wide text-muted">
          {{ product().brand }}
        </p>
        <h3 class="mt-1 line-clamp-2 min-h-11 font-display text-base font-bold leading-snug">
          <a [href]="'/producto/' + product().id">{{ product().name }}</a>
        </h3>
        <p class="mt-1 text-sm text-muted">
          ★ {{ product().rating }} ({{ product().reviews }})
        </p>
        <p class="mt-auto flex min-h-7 items-baseline gap-2 pt-2">
          <span class="font-display text-lg font-extrabold">{{
            product().price | currency: 'PEN' : 'S/ ' : '1.2-2'
          }}</span>
          @if (product().oldPrice) {
            <s class="text-sm text-muted">{{ product().oldPrice | currency: 'PEN' : 'S/ ' : '1.2-2' }}</s>
          }
        </p>
        <a
          [href]="'/producto/' + product().id"
          class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink"
        >
          Comprar →
        </a>
      </div>
    </article>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
}
