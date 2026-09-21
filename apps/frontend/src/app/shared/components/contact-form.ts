import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="space-y-4"
      [attr.aria-label]="label()"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label [for]="prefix() + '-name'" class="text-sm font-medium">Nombre</label>
          <input
            [id]="prefix() + '-name'"
            type="text"
            placeholder="Tu nombre"
            autocomplete="name"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
        <div>
          <label [for]="prefix() + '-email'" class="text-sm font-medium">Email</label>
          <input
            [id]="prefix() + '-email'"
            type="email"
            placeholder="tu@correo.com"
            autocomplete="email"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label [for]="prefix() + '-pet'" class="text-sm font-medium">Mascota</label>
          <select
            [id]="prefix() + '-pet'"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option>Perro</option>
            <option>Gato</option>
            <option>Otra</option>
          </select>
        </div>
        <div>
          <label [for]="prefix() + '-topic'" class="text-sm font-medium">Motivo</label>
          <select
            [id]="prefix() + '-topic'"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option>Duda sobre un producto</option>
            <option>Estado de mi pedido</option>
            <option>Cambio o devolución</option>
            <option>Otro tema</option>
          </select>
        </div>
      </div>
      <div>
        <label [for]="prefix() + '-message'" class="text-sm font-medium">Mensaje</label>
        <textarea
          [id]="prefix() + '-message'"
          rows="4"
          placeholder="¿Qué necesita tu peludo?"
          class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
        ></textarea>
      </div>
      <button
        type="button"
        class="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink"
      >
        Enviar mensaje
      </button>
      <p class="text-center text-sm text-muted">
        Te atiende una persona real, no un bot.
      </p>
    </form>
  `,
})
export class ContactForm {
  readonly prefix = input('contact');
  readonly label = input('Formulario de contacto');
}
