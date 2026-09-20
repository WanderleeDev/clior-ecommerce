import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { Router, RouterLink } from '@angular/router';
import { SectionTag } from '../shared/components/section-tag';
import { CtaButton } from '../shared/components/cta-button';
import { AuthUsecase } from '../auth/domain/ports/in/auth.usecase';
import { AuthStore } from '../auth/presentation/state/auth.store';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [NgxIconify, RouterLink, SectionTag, CtaButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <app-section-tag label="Mi cuenta" />
      @if (user()) {
        <div class="mt-3 flex flex-wrap items-center gap-4">
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 font-display text-2xl font-extrabold text-accent"
          >
            {{ initials() }}
          </span>
          <div>
            <h1 class="font-display text-3xl font-extrabold md:text-4xl">
              Hola, {{ user()?.name }}
            </h1>
            <p class="mt-1 text-sm text-muted">
              {{ user()?.email }} · Miembro desde {{ user()?.memberSince }}
            </p>
          </div>
          <button
            type="button"
            (click)="onLogout()"
            class="ml-auto inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
          >
            <ngx-iconify icon="lucide:log-out" [size]="16" />
            Cerrar sesión
          </button>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <div class="rounded-2xl border border-line bg-surface p-6">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
              <ngx-iconify icon="noto:dog-face" [size]="24" />
            </span>
            <h2 class="mt-3 font-display text-lg font-bold">Mi mascota</h2>
            <p class="mt-1 text-sm text-muted">{{ user()?.pet }}</p>
          </div>
          <div class="rounded-2xl border border-line bg-surface p-6">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
              <ngx-iconify icon="lucide:package" [size]="22" />
            </span>
            <h2 class="mt-3 font-display text-lg font-bold">Mis pedidos</h2>
            <p class="mt-1 text-sm text-muted">3 pedidos · 1 en camino</p>
            <a routerLink="/carrito" class="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Ver carrito →
            </a>
          </div>
          <div class="rounded-2xl border border-line bg-surface p-6">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
              <ngx-iconify icon="lucide:heart" [size]="22" />
            </span>
            <h2 class="mt-3 font-display text-lg font-bold">Favoritos</h2>
            <p class="mt-1 text-sm text-muted">12 productos guardados</p>
            <a routerLink="/catalogo" class="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Explorar catálogo →
            </a>
          </div>
        </div>
      } @else {
        <h1 class="mt-3 font-display text-3xl font-extrabold md:text-5xl">
          Mi <span class="text-muted">cuenta.</span>
        </h1>
        <p class="mt-3 max-w-xl text-muted">
          Inicia sesión para ver tus pedidos, favoritos y puntos Huella.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <app-cta-button label="Iniciar sesión" href="/ingresar" />
          <app-cta-button label="Crear cuenta" href="/registro" variant="secondary" />
        </div>
      }
    </section>
  `,
})
export class AccountPage {
  private readonly auth = inject(AuthUsecase);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly user = this.store.current;
  protected readonly initials = computed(() =>
    (this.user()?.name ?? '?')
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  constructor() {
    this.auth.me().subscribe((u) => this.store.set(u));
  }

  protected onLogout(): void {
    this.auth.logout().subscribe(() => {
      this.store.clear();
      void this.router.navigate(['/']);
    });
  }
}
