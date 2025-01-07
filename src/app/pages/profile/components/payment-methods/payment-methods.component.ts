import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  PaymentCardType,
  PaymentMethod,
} from '../../interfaces/PaymentMethod.interface';
import { MastercardSvgComponent } from '../../../../shared/icons/mastercard-svg.component';
import { VisaSvgComponent } from '../../../../shared/icons/visa-svg.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-payment-methods',
  imports: [NgComponentOutlet],
  templateUrl: './payment-methods.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodsComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly icons: Record<PaymentCardType, any> = {
    visa: VisaSvgComponent,
    mastercard: MastercardSvgComponent,
  };
  readonly paymentMethods = input<PaymentMethod[]>([
    {
      type: 'visa',
      lastFourDigits: '1234',
      expiryDate: '12/25',
      logoLight: 'assets/images/visa.png',
      logoDark: 'assets/images/visa-dark.png',
    },
  ]);
}
