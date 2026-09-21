import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

@Component({
  selector: 'app-cta-button',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [href]="href()"
      [class]="variant() === 'primary' ? primaryCls : secondaryCls"
    >
      <span>{{ label() }}</span>
      <ngx-iconify icon="lucide:arrow-right" [size]="20" />
    </a>
  `,
})
export class CtaButton {
  readonly label = input.required<string>();
  readonly href = input<string>('/catalogo');
  readonly variant = input<'primary' | 'secondary'>('primary');

  protected readonly primaryCls =
    'inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink';
  protected readonly secondaryCls =
    'inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium text-foreground';
}
