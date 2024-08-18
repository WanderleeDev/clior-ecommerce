import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { DarkThemeService } from './shared/services/darkTheme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  #flowbiteService = inject(FlowbiteService);
  #darkThemeService = inject(DarkThemeService);

  ngOnInit(): void {
    this.#flowbiteService.loadFlowbite();
    this.#darkThemeService.verifyTheme()
  }
}
