import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-divider',
  template: `<hr
    class="scale-y-150 rounded-lg"
    [style.backgroundColor]="color()"
    [style.borderColor]="color()"
    [style.marginBlock]="spacingYTransform()"
    [style.height]="height() + 'px'"
    [class]="customClass()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  readonly color = input<string>('#fff');
  readonly customClass = input<string>('');
  readonly height = input<number>(3);
  readonly spacingY = input<Spacing>('xs');
  readonly #spacingList: Record<Spacing, string> = {
    xs: '0rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  };
  protected readonly spacingYTransform = computed(
    () => this.#spacingList[this.spacingY()],
  );
}
