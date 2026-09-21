import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { Dialogue } from '../shared/components/dialogue';
import { ContactForm } from '../shared/components/contact-form';

interface ContactChannel {
  icon: string;
  title: string;
  detail: string;
  action: string;
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [NgxIconify, Dialogue, ContactForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <h1 class="font-display text-3xl font-extrabold md:text-5xl">
        Contáctanos
      </h1>
      <p class="mt-3 max-w-2xl text-muted">
        Escríbenos por donde prefieras. Te responde una persona real, no un bot.
      </p>

      <div class="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div class="space-y-4">
          @for (channel of channels; track channel.title) {
            <div
              class="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
              >
                <ngx-iconify [icon]="channel.icon" [size]="24" />
              </span>
              <div class="flex-1">
                <h2 class="font-display font-bold">{{ channel.title }}</h2>
                <p class="text-sm text-muted">{{ channel.detail }}</p>
              </div>
              <span class="text-sm font-bold text-accent">{{ channel.action }}</span>
            </div>
          }
          <div class="rounded-2xl bg-brand-deep p-6 text-white">
            <p class="font-display text-lg font-bold">Horario de atención</p>
            <p class="mt-1 text-sm text-white/70">
              Lun a Sáb · 9am a 7pm. Tiempo de respuesta típico: dentro de 12
              horas hábiles.
            </p>
          </div>
        </div>

        <div class="h-fit rounded-3xl border border-line bg-background p-6 sm:p-8">
          <app-contact-form prefix="contact-page" label="Formulario de contacto" />
        </div>
      </div>
    </section>

    <app-dialogue
      question="¿Prefieres resolverlo por tu cuenta?"
      answer="Quizá ya respondimos tu duda aquí:"
    />
  `,
})
export class ContactPage {
  protected readonly channels: ContactChannel[] = [
    {
      icon: 'lucide:check',
      title: 'WhatsApp',
      detail: '+51 999 888 777 · respuesta en minutos',
      action: 'Escríbenos →',
    },
    {
      icon: 'lucide:star',
      title: 'Correo',
      detail: 'hola@example.com',
      action: 'Enviar →',
    },
    {
      icon: 'lucide:truck',
      title: 'Tienda Lima',
      detail: 'Av. Principal 123 · Lun a Sáb 9am–7pm',
      action: 'Cómo llegar →',
    },
  ];
}
