import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TESTIMONIALS } from '../../../products/infrastructure/adapters/mock-product.adapter';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="opiniones"
      class="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6"
      aria-label="Opiniones"
    >
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
          <span class="text-muted">Lo que dicen</span> los dueños
        </h2>
      </div>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        @for (t of testimonials; track t.owner) {
          <figure
            class="flex flex-col rounded-2xl border border-line bg-surface p-6"
          >
            <img
              [src]="t.image"
              [alt]="t.imageAlt"
              loading="lazy"
              width="400"
              height="300"
              class="mb-4 aspect-video w-full rounded-xl object-cover"
            />
            <blockquote class="text-sm italic leading-relaxed">
              “{{ t.quote }}”
            </blockquote>
            <figcaption class="mt-4">
              <p class="font-medium text-accent">{{ t.owner }}</p>
              <p class="text-sm text-muted">{{ t.role }} · {{ t.pet }}</p>
            </figcaption>
          </figure>
        }
      </div>
    </section>
  `,
})
export class Testimonials {
  protected readonly testimonials = TESTIMONIALS;
}
