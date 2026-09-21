import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import type { Review } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-label="Opiniones del producto">
      <h2 class="font-display text-2xl font-extrabold md:text-3xl">
        Opiniones <span class="text-muted">de dueños.</span>
      </h2>

      <div class="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div class="h-fit rounded-2xl border border-line bg-surface p-6 text-center lg:sticky lg:top-24">
          <p class="font-display text-5xl font-extrabold">{{ average() }}</p>
          <p class="mt-1 flex items-center justify-center gap-1 text-star" aria-label="Calificación {{ average() }} de 5">
            @for (star of stars(); track $index) {
              <ngx-iconify icon="lucide:star" [size]="18" />
            }
          </p>
          <p class="mt-2 text-sm text-muted">
            Basado en {{ reviews().length }} opiniones
          </p>
          <button
            type="button"
            class="mt-4 inline-flex w-full items-center justify-center rounded-full border border-line px-4 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none hover:border-accent hover:text-accent"
          >
            Escribir opinión
          </button>
        </div>

        <div class="space-y-4">
          @for (review of reviews(); track review.author) {
            <article class="rounded-2xl border border-line bg-surface p-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="flex items-center gap-1 text-sm font-bold text-star" aria-label="{{ review.rating }} de 5 estrellas">
                  ★ {{ review.rating }}
                  <span class="font-normal text-muted">· {{ review.date }}</span>
                </p>
                <p class="inline-flex items-center gap-1 text-xs text-muted">
                  <ngx-iconify icon="lucide:check" [size]="14" class="text-accent" />
                  Compra verificada
                </p>
              </div>
              <h3 class="mt-2 font-display font-bold">{{ review.title }}</h3>
              <p class="mt-1 text-sm leading-relaxed text-muted">{{ review.text }}</p>
              <p class="mt-3 text-sm">
                <span class="font-medium">{{ review.author }}</span>
                <span class="text-muted"> · {{ review.pet }}</span>
              </p>
              <button
                type="button"
                class="mt-3 inline-flex items-center gap-1 text-xs text-muted hover:text-accent"
              >
                Útil ({{ review.helpful }})
              </button>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProductReviews {
  readonly reviews = input.required<Review[]>();

  protected readonly average = computed(() => {
    const reviews = this.reviews();
    if (!reviews.length) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  });

  protected readonly stars = computed(() =>
    Array(Math.round(Number(this.average()))).fill(0),
  );
}
