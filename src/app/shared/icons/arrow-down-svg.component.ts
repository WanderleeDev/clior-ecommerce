import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconComponent } from '../base-component/base-icon.component';

@Component({
    selector: 'app-arrow-down-svg',
    imports: [],
    template: `
    <svg
      class="size-3 text-gray-800 dark:text-white pt-1"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 8"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
      />
    </svg>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrowDownSvgComponent extends BaseIconComponent {}
