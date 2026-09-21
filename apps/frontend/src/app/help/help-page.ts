import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HelpModal } from '../layout/help-modal';
import { Dialogue } from '../shared/components/dialogue';
import { Faq } from '../shared/components/faq';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [HelpModal, Dialogue, Faq],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <h1 class="font-display text-3xl font-extrabold md:text-5xl">
        Centro de ayuda
      </h1>
      <p class="mt-3 max-w-2xl text-muted">
        Respuestas directas y ayuda de una persona real cuando la necesites.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-4">
        <p class="font-display text-xl font-bold">
          ¿Necesitas ayuda con tu pedido?
        </p>
        <app-help-modal />
      </div>
    </section>
    <app-dialogue
      question="Antes de comprar, tengo algunas preguntas más."
      answer="Probablemente las respondemos justo aquí:"
    />
    <app-faq />
  `,
})
export class HelpPage {}
