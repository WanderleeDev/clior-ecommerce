import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BrandMarquee } from './brand-marquee/brand-marquee';

@Component({
  selector: 'app-perks',
  standalone: true,
  imports: [BrandMarquee],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="marcas"
      class="scroll-mt-20 py-16 sm:py-20"
      aria-label="Marcas aliadas"
    >
      <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p class="text-base text-muted md:text-lg">
          Trabajamos directo con más de 40 marcas verificadas. Estas son
          algunas de las favoritas de la manada:
        </p>
      </div>
      <app-brand-marquee />
    </section>
  `,
})
export class Perks {}
