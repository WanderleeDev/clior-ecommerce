import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-link-base',
  imports: [RouterLink, RouterLinkActive],
  template: ` <a
    class="text-blue-500 text-sm font-medium md:text-base block"
    [class.underline]="underline()"
    [class]="customClass()"
    [class.w-full]="wMax()"
    [class.w-max]="!wMax()"
    [routerLink]="href()"
    [attr.aria-label]="ariaLabel()"
    [routerLinkActive]="activeClass()"
  >
    <ng-content> Navigate to </ng-content>
  </a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkBaseComponent {
  readonly href = input.required<string>();
  readonly ariaLabel = input<string | null>(null);
  readonly underline = input(false, { transform: booleanAttribute });
  readonly customClass = input<string | null>(null);
  readonly activeClass = input<string>('');
  readonly wMax = input(false, { transform: booleanAttribute });
}
