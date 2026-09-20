import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { REVIEWS } from '../products/infrastructure/adapters/mock-product.adapter';

@Component({
  selector: 'app-opinions-page',
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6"
      aria-label="Opiniones"
    >
      <div class="mx-auto max-w-2xl text-center">
        <h1 class="font-display text-3xl font-extrabold md:text-5xl">
          <span class="text-muted">Lo que dicen</span> otros dueños
        </h1>
        <p class="mt-4 text-muted">
          Opiniones reales de quienes ya confían en Clior Pets para sus mascotas.
        </p>
      </div>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        @for (r of reviews; track r.author) {
          <article
            class="flex flex-col rounded-2xl border border-line bg-surface p-6"
          >
            <div class="flex items-center gap-1 text-accent">
              @for (i of stars(r.rating); track $index) {
                <ngx-iconify icon="lucide:star" [size]="16" />
              }
            </div>
            <p class="mt-3 text-sm italic leading-relaxed">
              "{{ r.title }}"
            </p>
            <blockquote class="mt-2 text-sm leading-relaxed text-muted">
              {{ r.text }}
            </blockquote>
            <figcaption class="mt-4">
              <p class="font-medium text-accent">{{ r.author }}</p>
              <p class="text-sm text-muted">{{ r.pet }} · {{ r.date }}</p>
            </figcaption>
          </article>
        }
      </div>
    </section>
  `,
})
export class OpinionsPage {
  protected readonly reviews = REVIEWS;

  protected stars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
