import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconComponent } from '../base-component/base-icon.component';

@Component({
  selector: 'app-return-svg',
  standalone: true,
  imports: [],
  template: `
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
      ></path>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnSvgComponent extends BaseIconComponent {}
