import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  standalone: true,
  template: `<mark
    class="text-white text-xs font-semibold px-2.5 py-1 rounded select-none flex gap-1 w-min text-nowrap"
    [style.backgroundColor]="bgColor()"
  >
    <ng-content select="icon-left" />
    {{ content() }}
    <ng-content select="icon-right" />
  </mark>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly content = input.required<string>();
  readonly bgColor = input<string>('#7E3AF2');
}
