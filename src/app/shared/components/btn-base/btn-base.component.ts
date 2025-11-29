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
      [class]="
        btnStyles[variant()] +
        ' ' +
        btnSpaces[space()] +
        ' w-full disabled:opacity-70 disabled:cursor-not-allowed transition-all'
      "
      [disabled]="disabled()"
      [type]="type()"
      [attr.title]="title()"
    >
      <ng-content> Click </ng-content>
    </button>
  `,
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

  protected readonly btnStyles = {
    primary:
      'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80',
    outline:
      'text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm flex items-center justify-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 outline-none',
    danger:
      'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 flex items-center justify-center gap-2 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80',
  };

  protected readonly btnSpaces = {
    small: 'p-2.5',
    medium: 'px-5 py-2.5',
    large: 'px-6 py-3',
  };
}
