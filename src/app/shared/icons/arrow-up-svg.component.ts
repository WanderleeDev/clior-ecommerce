import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconComponent } from '../base-component/base-icon.component';

@Component({
  selector: 'app-arrow-up-svg',
  standalone: true,
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
        d="M12 6v13m0-13 4 4m-4-4-4 4"
      ></path>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowUpSvgComponent extends BaseIconComponent {}
