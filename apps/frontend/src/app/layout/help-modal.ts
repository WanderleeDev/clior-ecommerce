import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="open.set(true)"
      class="rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
    >
      Ayuda
    </button>
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Ayuda"
      >
        <div
          class="w-full max-w-lg rounded-2xl border border-line bg-background p-6"
        >
          <h2 class="font-display text-2xl font-extrabold">
            ¿En qué te ayudamos?
          </h2>
          <p class="mt-2 text-sm text-muted">
            Cuéntanos qué necesita tu mascota y te responde una persona real.
          </p>
          <form class="mt-5 space-y-4" aria-label="Formulario de ayuda visual">
            <div>
              <label for="help-name" class="text-sm font-medium">Nombre</label>
              <input
                id="help-name"
                type="text"
                placeholder="Tu nombre"
                class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label for="help-email" class="text-sm font-medium">Email</label>
              <input
                id="help-email"
                type="email"
                placeholder="tu@correo.com"
                class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label for="help-pet" class="text-sm font-medium">Mascota</label>
              <select
                id="help-pet"
                class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm"
              >
                <option>Perro</option>
                <option>Gato</option>
                <option>Otra</option>
              </select>
            </div>
            <div>
              <label for="help-message" class="text-sm font-medium"
                >Mensaje</label
              >
              <textarea
                id="help-message"
                rows="3"
                placeholder="¿Qué necesita tu peludo?"
                class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm"
              ></textarea>
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
              >
                Enviar mensaje
              </button>
              <button
                type="button"
                (click)="open.set(false)"
                class="rounded-full border border-line px-4 py-2 text-sm"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class HelpModal {
  protected readonly open = signal(false);
}
