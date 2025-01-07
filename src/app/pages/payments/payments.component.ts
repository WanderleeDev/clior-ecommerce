import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-payments',
    imports: [],
    templateUrl: './payments.component.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PaymentsComponent {}
