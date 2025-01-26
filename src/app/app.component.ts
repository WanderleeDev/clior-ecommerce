import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  readonly #flowbiteService = inject(FlowbiteService);
  public readonly GM_KEY = signal(
    'AIzaSyByoFSz_LQJMfPF0O_C7VOCLyBxm1T6G1g',
  ).asReadonly();

  ngOnInit() {
    this.#flowbiteService.loadFlowbite();

    this.#flowbiteService.reinitializeFlowbite();
  }
}
