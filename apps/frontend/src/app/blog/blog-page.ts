import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TESTIMONIALS } from '../products/infrastructure/adapters/mock-product.adapter';

@Component({
  selector: 'app-blog-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6"
      aria-label="Blog"
    >
      <div class="mx-auto max-w-2xl text-center">
        <h1 class="font-display text-3xl font-extrabold md:text-5xl">
          Blog
        </h1>
        <p class="mt-4 text-muted">
          Consejos, guías y novedades para el cuidado de tu mascota.
        </p>
      </div>
      <div class="mt-10 grid gap-6">
        @for (t of posts; track t.owner) {
          <article
            class="rounded-2xl border border-line bg-surface p-6"
          >
            <div class="flex items-center gap-3">
              <img
                [src]="t.image"
                [alt]="t.imageAlt"
                loading="lazy"
                width="48"
                height="48"
                class="rounded-full object-cover"
              />
              <div>
                <p class="font-medium text-accent">{{ t.owner }}</p>
                <p class="text-sm text-muted">{{ t.role }} · {{ t.pet }}</p>
              </div>
            </div>
            <blockquote class="mt-4 text-sm italic leading-relaxed">
              "{{ t.quote }}"
            </blockquote>
          </article>
        }
      </div>
    </section>
  `,
})
export class BlogPage {
  protected readonly posts = TESTIMONIALS;
}
