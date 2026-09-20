import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="fixed bottom-16 left-4 z-40 max-w-sm rounded-2xl border border-line bg-background p-5 shadow-xl md:bottom-6 md:left-6"
        role="region"
        aria-label="Aviso de cookies"
      >
        <p class="text-sm text-muted">
          Usamos cookies para mejorar tu experiencia y mostrarte ofertas que le
          gusten a tu mascota. Tú decides.
        </p>
        <div class="mt-4 flex gap-2">
          <button
            type="button"
            (click)="visible.set(false)"
            class="flex-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
          >
            Aceptar todo
          </button>
          <button
            type="button"
            (click)="visible.set(false)"
            class="flex-1 rounded-full border border-line px-4 py-2 text-sm"
          >
            Rechazar
          </button>
        </div>
      </div>
    }
  `,
})
export class CookieBanner {
  protected readonly visible = signal(true);
}
