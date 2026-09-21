import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { SectionTag } from '../shared/components/section-tag';
import { CtaButton } from '../shared/components/cta-button';
import { PRODUCTS } from '../products/infrastructure/adapters/mock-product.adapter';

interface CartLine {
  id: string;
  qty: number;
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgxIconify, SectionTag, CtaButton, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <app-section-tag label="Carrito" />
      <h1 class="mt-3 font-display text-3xl font-extrabold md:text-5xl">
        Tu carrito
      </h1>

      @if (isEmpty()) {
        <div class="mt-10 rounded-3xl border border-line bg-surface p-10 text-center">
          <ngx-iconify
            icon="noto:shopping-cart"
            [size]="64"
            class="mx-auto"
          />
          <h2 class="mt-4 font-display text-2xl font-bold">
            Tu carrito está vacío
          </h2>
          <p class="mx-auto mt-2 max-w-md text-muted">
            Tu peludo te está mirando con esos ojos… Explora el catálogo y
            encuentra algo rico.
          </p>
          <div class="mt-6">
            <app-cta-button label="Explorar catálogo" href="/catalogo" />
          </div>
        </div>
      } @else {
        <div class="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div class="divide-y divide-line rounded-2xl border border-line">
            @for (line of lines(); track line.id) {
              <div class="flex gap-4 p-4 sm:p-5">
                <img
                  [src]="line.image"
                  [alt]="line.imageAlt"
                  loading="lazy"
                  width="160"
                  height="160"
                  class="size-24 shrink-0 rounded-xl object-cover sm:size-32"
                />
                <div class="flex flex-1 flex-col">
                  <p class="text-xs uppercase tracking-wide text-muted">
                    {{ line.brand }}
                  </p>
                  <h2 class="font-display font-bold leading-snug">
                    {{ line.name }}
                  </h2>
                  <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <span
                      class="inline-flex items-center gap-3 rounded-full border border-line px-4 py-1 text-sm"
                    >
                      <ngx-iconify icon="lucide:minus" [size]="16" />
                      {{ line.qty }}
                      <ngx-iconify icon="lucide:plus" [size]="16" />
                    </span>
                    <p class="font-display font-extrabold">
                      {{ line.price * line.qty | currency: 'PEN' : 'S/ ' : '1.2-2' }}
                    </p>
                  </div>
                  <p class="mt-2 inline-flex items-center gap-1 text-sm text-muted">
                    <ngx-iconify icon="lucide:trash-2" [size]="14" />
                    Quitar
                  </p>
                </div>
              </div>
            }
          </div>

          <aside class="h-fit rounded-2xl border border-line bg-surface p-6">
            <h2 class="font-display text-xl font-bold">Resumen</h2>
            <dl class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-muted">Subtotal (3 productos)</dt>
                <dd class="font-medium">{{ subtotal() | currency: 'PEN' : 'S/ ' : '1.2-2' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Envío</dt>
                <dd class="font-medium text-accent">Gratis</dd>
              </div>
              <div class="flex justify-between border-t border-line pt-3 text-base">
                <dt class="font-bold">Total</dt>
                <dd class="font-display font-extrabold">{{ subtotal() | currency: 'PEN' : 'S/ ' : '1.2-2' }}</dd>
              </div>
            </dl>
            <div class="mt-5">
              <app-cta-button label="Finalizar compra" href="/carrito" />
            </div>
            <a
              href="/catalogo"
              class="mt-3 block text-center text-sm text-accent hover:underline"
            >
              Seguir comprando
            </a>
            <div class="mt-5 space-y-2 border-t border-line pt-4 text-sm text-muted">
              <p class="inline-flex items-center gap-2">
                <ngx-iconify icon="lucide:truck" [size]="16" />
                Llega mañana en Lima
              </p>
              <p class="inline-flex items-center gap-2">
                <ngx-iconify icon="lucide:shield-check" [size]="16" />
                Compra 100% protegida
              </p>
            </div>
          </aside>
        </div>
      }
    </section>
  `,
})
export class CartPage {
  protected readonly isEmpty = signal(false);

  protected readonly lines = signal(
    [
      { ...PRODUCTS[0], qty: 1 },
      { ...PRODUCTS[2], qty: 2 },
      { ...PRODUCTS[5], qty: 1 },
    ] as (CartLine & (typeof PRODUCTS)[number])[],
  );

  protected subtotal(): number {
    return this.lines().reduce((acc, l) => acc + l.price * l.qty, 0);
  }
}
