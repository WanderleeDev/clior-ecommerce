import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { SectionTag } from '../../../shared/components/section-tag';
import { CATEGORIES } from '../../../products/infrastructure/adapters/mock-product.adapter';

@Component({
  selector: 'app-categories-accordion',
  standalone: true,
  imports: [NgxIconify, SectionTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-label="Categorías">
      <app-section-tag label="Qué encuentras" />
      <h2 class="mt-3 max-w-2xl font-display text-3xl font-extrabold md:text-4xl">
        Todo por especie <span class="text-muted">y necesidad.</span>
      </h2>
      <div class="mt-10 grid gap-10 lg:grid-cols-2">
        <div class="relative hidden overflow-hidden rounded-2xl lg:block">
          <img
            [src]="active().image"
            [alt]="active().imageAlt"
            loading="lazy"
            width="1024"
            height="1024"
            class="sticky top-24 aspect-square w-full object-cover"
          />
        </div>
        <div class="divide-y divide-line border-y border-line">
          @for (cat of categories; track cat.slug; let i = $index) {
            <div class="py-6">
              <button
                type="button"
                (click)="open.set(i)"
                [attr.aria-expanded]="open() === i"
                class="flex w-full items-center justify-between gap-4 text-left"
              >
                <span>
                  <span class="font-display text-xl font-bold">{{
                    cat.title
                  }}</span>
                  <span class="block text-sm text-accent">{{ cat.tagline }}</span>
                </span>
                <ngx-iconify
                  icon="lucide:plus"
                  [size]="20"
                  class="shrink-0 text-foreground"
                />
              </button>
              @if (open() === i) {
                <div class="mt-4">
                  <img
                    [src]="cat.image"
                    [alt]="cat.imageAlt"
                    loading="lazy"
                    width="800"
                    height="600"
                    class="mb-4 aspect-video w-full rounded-xl object-cover lg:hidden"
                  />
                  <p class="text-muted">{{ cat.description }}</p>
                  <a
                    href="/catalogo"
                    class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent"
                  >
                    {{ cat.linkLabel }}
                    <ngx-iconify icon="lucide:arrow-right" [size]="16" />
                  </a>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class CategoriesAccordion {
  protected readonly categories = CATEGORIES;
  protected readonly open = signal(0);

  protected active() {
    return this.categories[this.open()];
  }
}
