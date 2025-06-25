import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-tag',
  standalone: true,
  template: `<mark
    class="text-white text-xs font-semibold p-1 rounded select-none flex gap-1 text-nowrap justify-center"
    [class.rounded-full]="roundedFull()"
    [class.w-min]="!wmax()"
    [class.w-full]="wmax()"
    [class.justify-center]="wmax()"
    [style.backgroundColor]="bgColor()"
  >
    <ng-content select="icon-left" />
    {{ content() }}
    <ng-content select="icon-right" />
  </mark>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly content = input.required<string | number>();
  readonly bgColor = input<string>('#7E3AF2');
  readonly roundedFull = input(false, {
    transform: booleanAttribute,
  });
  readonly wmax = input(false, {
    transform: booleanAttribute,
  });
}
