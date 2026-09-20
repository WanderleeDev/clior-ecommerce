import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-cta',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/90 p-3 backdrop-blur-md md:hidden"
    >
      <a
        routerLink="/catalogo"
        class="block rounded-full bg-accent px-6 py-3 text-center font-medium text-accent-ink"
      >
        Ver catálogo
      </a>
    </div>
  `,
})
export class MobileCta {}
