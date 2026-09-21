import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import type { Brand } from '../../../domain/models/product.model';

@Component({
  selector: 'app-brand-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <article
      class="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition motion-reduce:transition-none group-hover:border-accent hover:border-accent"
    >
      <div class="relative aspect-[16/10] overflow-hidden bg-surface">
        <img
          [src]="brand().image"
          [alt]="brand().imageAlt"
          loading="lazy"
          width="800"
          height="500"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="flex flex-1 flex-col p-5">
        <h3 class="font-display text-xl font-bold">{{ brand().name }}</h3>
        <p class="mt-1 line-clamp-2 min-h-10 text-sm text-muted">
          {{ brand().description }}
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          @for (tag of brand().tags; track tag) {
            <span
              class="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {{ tag }}
            </span>
          }
        </div>
        <a
          [href]="'/catalogo?marca=' + brand().name"
          class="mt-4 inline-flex w-full items-center justify-center rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none group-hover:border-accent group-hover:text-accent"
        >
          Ver productos →
        </a>
      </div>
    </article>
  `,
})
export class BrandCard {
  readonly brand = input.required<Brand>();
}
