import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { DarkThemeService } from './shared/services/darkTheme.service';
import { scrollTopViewport } from './shared/utils/scrollTopViewport';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  readonly #flowbiteService = inject(FlowbiteService);
  readonly #darkThemeService = inject(DarkThemeService);
  readonly router = inject(Router);
  readonly #platform = inject(PLATFORM_ID);

  ngOnInit() {
    this.#flowbiteService.loadFlowbite();
    this.#darkThemeService.verifyTheme();

    if (isPlatformBrowser(this.#platform)) {
      this.router.events.subscribe(() => scrollTopViewport());
    }
  }
}
