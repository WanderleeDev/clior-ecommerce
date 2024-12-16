import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-repayment',
  standalone: true,
  imports: [],
  templateUrl: './repayment.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepaymentComponent { }
