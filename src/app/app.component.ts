import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { DarkThemeService } from './shared/services/darkTheme.service';
import { scrollTopViewport } from './shared/utils/scrollTopViewport';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: '<router-outlet />',
    styleUrls: []
})
export class AppComponent implements OnInit {
  readonly #flowbiteService = inject(FlowbiteService);
  readonly #darkThemeService = inject(DarkThemeService);
  readonly router = inject(Router);
  readonly #platform = inject(PLATFORM_ID);
  public readonly GM_KEY = signal(
    'AIzaSyByoFSz_LQJMfPF0O_C7VOCLyBxm1T6G1g',
  ).asReadonly();

  ngOnInit() {
    this.#flowbiteService.loadFlowbite();
    this.#darkThemeService.verifyTheme();

    if (isPlatformBrowser(this.#platform)) {
      this.router.events.subscribe(() => scrollTopViewport());
    }
  }
}
