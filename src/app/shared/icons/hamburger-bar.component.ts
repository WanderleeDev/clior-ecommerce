import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconComponent } from '../base-component/base-icon.component';

@Component({
    selector: 'app-hamburger-bar',
    imports: [],
    template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HamburgerBarComponent extends BaseIconComponent {}
