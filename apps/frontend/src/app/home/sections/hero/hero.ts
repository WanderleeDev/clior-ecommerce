import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { UiCarousel } from '../../../shared/components/ui-carousel';

@Component({
  selector: 'app-hero',
  imports: [NgxIconify, UiCarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly slides = [
    {
      src: '/food.png',
      alt: 'Alimento premium sabor carne 3 kg junto a plato de croquetas',
      title: 'Sabor Carne 3 kg',
      detail: 'S/ 89.90 · ★ 4.8',
      href: '/catalogo',
    },
    {
      src: '/food2.png',
      alt: 'Alimento natural Feliz Can de pollo 1.5 kg junto a plato de croquetas',
      title: 'Feliz Can Pollo 1.5 kg',
      detail: 'S/ 49.90 · ★ 4.7',
      href: '/catalogo',
    },
    {
      src: '/food3.png',
      alt: 'Suplemento multivitamínico premium Clior Pets',
      title: 'Multivitamínico Clior Pets',
      detail: 'S/ 59.90 · ★ 4.9',
      href: '/catalogo',
    },
  ];
}
