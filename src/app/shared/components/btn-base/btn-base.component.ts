import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

type TypeButton = 'button' | 'submit' | 'reset';
type VariantButton = 'primary' | 'outline' | 'danger';
type SpaceButton = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-btn-base',
  standalone: true,
  template: `
    <button
      class="{{
        variant() + ' space-' + space() + ' w-full'
      }} disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      [disabled]="disabled()"
      [type]="type()"
      [attr.title]="title()"
    >
      <ng-content> Click </ng-content>
    </button>
  `,
  styleUrl: './btn-base.styles.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
    '[class.w-full]': 'maxSize()',
    '[class.w-max]': '!maxSize()',
  },
})
export class BtnBaseComponent {
  readonly maxSize = input(false, { transform: booleanAttribute });
  readonly type = input<TypeButton>('button');
  readonly variant = input<VariantButton>('primary');
  readonly space = input<SpaceButton>('medium');
  readonly title = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
}
