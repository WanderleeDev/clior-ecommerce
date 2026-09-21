import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from './sections/hero/hero';
import { TrustBar } from './sections/trust-bar/trust-bar';
import { Dialogue } from '../shared/components/dialogue';
import { ShopCategories } from './sections/shop-categories/shop-categories';
import { Specials } from './sections/specials/specials';
import { Pains } from './sections/pains/pains';
import { Perks } from './sections/perks/perks';
import { FeaturedProducts } from './sections/featured-products/featured-products';
import { Testimonials } from './sections/testimonials/testimonials';
import { HelpHouse } from './sections/help-house/help-house';

@Component({
  selector: 'app-home-page',
  imports: [
    Hero,
    TrustBar,
    Dialogue,
    ShopCategories,
    Specials,
    Pains,
    Perks,
    FeaturedProducts,
    Testimonials,
    HelpHouse,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-trust-bar />
    <app-dialogue
      question="Suena bien, ¿pero tendrán todo lo que mi mascota necesita?"
      answer="Sí, mira todo lo que tenemos para ella:"
    />
    <app-shop-categories />
    <app-specials />
    <app-featured-products />
    <app-dialogue
      question="¿Y si compro y algo no le queda o no le gusta?"
      answer="Buena pregunta, a muchos dueños les pasa lo mismo:"
    />
    <app-pains />
    <app-dialogue
      question="Hay muchas tiendas de mascotas. ¿Tienen las marcas que mi peludo ama?"
      answer="Las mejores. Mira quiénes nos acompañan:"
    />
    <app-perks />
    <app-dialogue
      question="Todo esto se ve bien. ¿Qué dicen otros dueños?"
      answer="Los resultados importan más que las promesas:"
    />
    <app-testimonials />
    <app-help-house />
  `,
})
export class HomePage {}
