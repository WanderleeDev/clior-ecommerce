import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

export interface CarouselItem {
  src: string;
  alt: string;
  title?: string;
  detail?: string;
  href?: string;
}

@Component({
  selector: 'app-ui-carousel',
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-carousel.html',
  styleUrl: './ui-carousel.css',
})
export class UiCarousel {
  readonly items = input.required<readonly CarouselItem[]>();
  readonly name = input.required<string>();
  readonly label = input('Carrusel');
}
