import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { scrollTopViewport } from '../../shared/utils/scrollTopViewport';

@Injectable({
  providedIn: 'root',
})
export class FlowbiteService {
  readonly #platform = inject(PLATFORM_ID);
  readonly #router = inject(Router);

  public loadFlowbite(): void {
    if (isPlatformBrowser(this.#platform)) {
      import('flowbite').then().catch((err) => {
        console.error(`Error loading flowbite: ${err}`);
      });
    }
  }

  public reinitializeFlowbite(): void {
    if (isPlatformServer(this.#platform)) return;

    this.#router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => initFlowbite(), 100);
      }

      scrollTopViewport();
    });
  }
}
