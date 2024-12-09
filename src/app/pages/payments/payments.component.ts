import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [],
  templateUrl: './payments.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaymentsComponent {}
