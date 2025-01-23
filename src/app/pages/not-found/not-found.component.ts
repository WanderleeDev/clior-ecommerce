import { isPlatformServer, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './not-found.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundComponent implements OnInit {
  readonly #PLATFORM_ID = inject(PLATFORM_ID);
  protected url = '';

  ngOnInit(): void {
    if (isPlatformServer(this.#PLATFORM_ID)) return;

    this.url = window.location.href;
  }
}
