import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DefaultControlErrorComponent,
  errorTailorImports,
} from '@ngneat/error-tailor';

@Component({
    selector: 'app-error-label',
    imports: [errorTailorImports],
    template: ` <span
    class="absolute bg-red-500 text-white left-0 bottom-0 px-2 translate-y-[110%] text-xs tracking-wide rounded-md border-gray-200 border-[.15rem ] select-none"
  >
    {{ errorText }}
  </span>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorLabelComponent extends DefaultControlErrorComponent {}
