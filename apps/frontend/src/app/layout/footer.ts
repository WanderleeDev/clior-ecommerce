import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-line bg-brand-deep text-white relative z-10">
      <div
        class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4"
      >
        <div>
          <p class="font-display text-xl font-extrabold">
            Clior&nbsp;<span class="text-accent">Pets</span>
          </p>
          <p class="mt-3 text-sm text-white/70">
            Todo para tu mascota: alimento, juguetes y accesorios con envío a
            todo el país.
          </p>
        </div>
        <nav aria-label="Tienda">
          <p class="font-display text-sm font-bold uppercase tracking-wide">
            Tienda
          </p>
          <ul class="mt-3 space-y-2 text-sm text-white/70">
            <li><a routerLink="/catalogo" class="hover:text-accent">Perros</a></li>
            <li><a routerLink="/catalogo" class="hover:text-accent">Gatos</a></li>
            <li>
              <a routerLink="/catalogo" class="hover:text-accent">Accesorios</a>
            </li>
            <li><a routerLink="/catalogo" class="hover:text-accent">Ofertas</a></li>
          </ul>
        </nav>
        <nav aria-label="Ayuda">
          <p class="font-display text-sm font-bold uppercase tracking-wide">
            Ayuda
          </p>
          <ul class="mt-3 space-y-2 text-sm text-white/70">
            <li><a routerLink="/ayuda" class="hover:text-accent">Preguntas frecuentes</a></li>
            <li><a routerLink="/carrito" class="hover:text-accent">Mi carrito</a></li>
            <li><a routerLink="/contacto" class="hover:text-accent">Contacto</a></li>
          </ul>
        </nav>
        <div>
          <p class="font-display text-sm font-bold uppercase tracking-wide">
            Novedades
          </p>
          <p class="mt-3 text-sm text-white/70">
            Ofertas y consejos cada semana. Sin spam.
          </p>
          <form class="mt-4 flex gap-2" aria-label="Suscripción visual">
            <label for="newsletter-email" class="sr-only"
              >Correo electrónico</label
            >
            <input
              id="newsletter-email"
              type="email"
              placeholder="tu@correo.com"
              class="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50"
            />
            <button
              type="button"
              class="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
            >
              Unirme
            </button>
          </form>
        </div>
      </div>
      <div class="border-t border-white/10">
        <p class="mx-auto max-w-7xl px-4 py-5 text-xs text-white/60 sm:px-6">
          © 2026 Clior Pets. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `,
})
export class Footer {}
