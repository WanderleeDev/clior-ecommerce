import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconComponent } from '../base-component/base-icon.component';

@Component({
  selector: 'app-star-svg',
  imports: [],
  template: `
    <svg
      aria-hidden="true"
      [attr.width]="size()"
      [attr.height]="size()"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <path
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        d="m234.5 114.38l-45.1 39.36l13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31l-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54l-45.11-39.42a16 16 0 0 1 9.11-28.06l59.46-5.15l23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z"
      />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarSvgComponent extends BaseIconComponent {}
