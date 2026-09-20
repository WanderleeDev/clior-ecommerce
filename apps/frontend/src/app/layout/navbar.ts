import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxIconify } from 'ngx-iconify-stack';
import { ThemeSelect } from './theme-select';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgxIconify, ThemeSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border border-line bg-background/80 px-4 shadow-lg backdrop-blur-xl sm:px-6"
        aria-label="Navegación principal"
      >
        <a
          routerLink="/"
          class="font-display text-xl font-extrabold tracking-tight"
        >
          Clior&nbsp;<span class="text-accent">Pets</span>
        </a>
        <div class="hidden items-center gap-6 text-sm lg:flex">
          <a routerLink="/catalogo" class="hover:text-accent">Tienda +</a>
          <a routerLink="/marcas" class="hover:text-accent">Marcas</a>
           <a routerLink="/opiniones" class="hover:text-accent">Opiniones +</a>
          <a routerLink="/ayuda" class="hover:text-accent">Nosotros</a>
          <a routerLink="/ayuda" class="hover:text-accent">Ayuda +</a>
          <a routerLink="/contacto" class="hover:text-accent">Contáctanos</a>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <a
            routerLink="/carrito"
            aria-label="Ver carrito"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground hover:border-accent"
          >
            <ngx-iconify icon="noto:shopping-cart" [size]="22" />
          </a>
          <app-theme-select />
          <a
            routerLink="/catalogo"
            class="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-accent-ink sm:inline-flex"
          >
            <span>Comprar ahora</span>
            <ngx-iconify icon="lucide:arrow-right" [size]="18" />
          </a>
          <button
            type="button"
            (click)="toggle()"
            [attr.aria-expanded]="open()"
            aria-label="Abrir menú"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground hover:border-accent lg:hidden"
          >
            <ngx-iconify
              [icon]="open() ? 'lucide:x' : 'lucide:menu'"
              [size]="20"
            />
          </button>
        </div>
      </nav>
      @if (open()) {
        <div
          class="mx-auto mt-2 max-w-7xl rounded-3xl border border-line bg-background/95 p-4 shadow-xl backdrop-blur-xl lg:hidden"
        >
          <div class="grid gap-1 text-sm">
            <a
              routerLink="/catalogo"
              (click)="close()"
              class="rounded-2xl px-4 py-3 hover:bg-surface"
              >Tienda +</a
            >
            <a
              routerLink="/marcas"
              (click)="close()"
              class="rounded-2xl px-4 py-3 hover:bg-surface"
              >Marcas</a
            >
            <a
              routerLink="/opiniones"
              (click)="close()"
              class="rounded-2xl px-4 py-3 hover:bg-surface"
              >Opiniones +</a
            >
            <a
              routerLink="/ayuda"
              (click)="close()"
              class="rounded-2xl px-4 py-3 hover:bg-surface"
              >Nosotros</a
            >
            <a
              routerLink="/ayuda"
              (click)="close()"
              class="rounded-2xl px-4 py-3 hover:bg-surface"
              >Ayuda +</a
            >
            <a
              routerLink="/contacto"
              (click)="close()"
              class="rounded-2xl px-4 py-3 hover:bg-surface"
              >Contáctanos</a
            >
            <a
              routerLink="/catalogo"
              (click)="close()"
              class="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-accent-ink"
            >
              <span>Comprar ahora</span>
              <ngx-iconify icon="lucide:arrow-right" [size]="18" />
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class Navbar {
  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}
