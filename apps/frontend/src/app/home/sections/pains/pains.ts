import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

@Component({
  selector: 'app-pains',
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pains.html',
  styleUrl: './pains.css',
})
export class Pains {
  protected readonly left = [
    {
      icon: 'noto:dog-face',
      question: '¿Compras alimento que tu perro ignora después del segundo día?',
      text: 'Cada bolsa rechazada es dinero perdido. Te orientamos con muestras y guía de transición alimenticia.',
    },
    {
      icon: 'noto:cat-face',
      question: '¿Los juguetes le duran menos que el empaque?',
      text: 'Probamos resistencia real antes de vender. Si dice "ultra resistente", es porque lo es.',
    },
  ];

  protected readonly right = [
    {
      icon: 'lucide:ruler',
      question: '¿Dudas entre tallas de arnés, ropa o camas?',
      text: 'Guías de medidas por peso y raza en cada producto, más ayuda de una persona real por chat.',
    },
    {
      icon: 'lucide:truck',
      question: '¿Tu pedido llega cuando ya lo necesitabas ayer?',
      text: 'Despacho en 24/48h con seguimiento en vivo. Si llegamos tarde, el envío va por nuestra cuenta.',
    },
  ];
}
