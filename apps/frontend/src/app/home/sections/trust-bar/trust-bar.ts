import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TRUST_STATS } from '../../../products/infrastructure/adapters/home-data.adapter';

@Component({
  selector: 'app-trust-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="historia"
      aria-label="Números de la tienda"
      class="scroll-mt-20 border-b border-line"
    >
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          @for (stat of stats; track stat.label) {
            <div>
              <p class="font-display text-3xl font-extrabold md:text-4xl">
                {{ stat.value
                }}<span class="text-accent">{{ stat.suffix }}</span>
              </p>
              <p class="mt-1 text-sm text-muted">{{ stat.label }}</p>
              <div class="mt-3 h-px w-full bg-line"></div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class TrustBar {
  protected readonly stats = TRUST_STATS;
}
