import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MetricData } from './interfaces/MetricData.interface';
import { DialogService } from '@ngneat/dialog';
import { CardMetricProfileComponent } from './components/card-metric-profile/card-metric-profile.component';
import { RouterLink } from '@angular/router';
import { SectionLayoutComponent } from '../../layout/section-layout.component';
import { InfoProfileComponent } from './components/info-profile/info-profile.component';
import { InfoProfile } from './interfaces/InfoProfile.interface';
import { BtnBaseComponent } from '../../shared/components/btn-base/btn-base.component';
import { EditSvgComponent } from '../../shared/icons/edit-svg.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { UserSimpleCardComponent } from './components/user-simple-card/user-simple-card.component';
import { FormEditDataUserComponent } from './components/form-edit-data-user/form-edit-data-user.component';
import { FormPaymentMethodsComponent } from './components/form-payment-methods/form-payment-methods.component';

@Component({
  selector: 'app-profile',
  imports: [
    CardMetricProfileComponent,
    RouterLink,
    SectionLayoutComponent,
    InfoProfileComponent,
    BtnBaseComponent,
    EditSvgComponent,
    PaymentMethodsComponent,
    UserSimpleCardComponent,
  ],
  templateUrl: './profile.component.html',
  hostDirectives: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {
  readonly #dialog = inject(DialogService);
  protected readonly performanceMetrics: MetricData[] = [
    {
      title: 'Orders made',
      value: 20,
      percentage: 0.103,
      date: new Date('2024-03-15'),
      status: 'up',
      type: 'orders',
    },
    {
      title: 'Reviews added',
      value: 16,
      percentage: 0.086,
      date: new Date('2024-03-15'),
      status: 'up',
      type: 'reviews',
    },
    {
      title: 'Favorite products added',
      value: 8,
      percentage: 0.12,
      date: new Date('2024-03-15'),
      status: 'down',
      type: 'favorites',
    },
    {
      title: 'Product returns',
      value: 2,
      percentage: 0.5,
      date: new Date('2024-03-15'),
      status: 'up',
      type: 'returns',
    },
  ];
  protected readonly userInfo: InfoProfile[] = [
    { label: 'email address', content: 'helene@example.com' },
    {
      label: 'home address',
      content: '2 Miles Drive, NJ 071, New York, United States of America',
    },
    {
      label: 'delivery address',
      content: '9th St. PATH Station, New York, United States of America',
    },
    {
      label: 'phone number',
      content: '+1234 567 890 / +12 345 678',
    },
    {
      label: 'favorite pick-up point',
      content: 'Herald Square, 2, New York, United States of America',
    },
    {
      label: 'my company',
      content: 'FLOWBITE LLC, Fiscal code: 18673557',
    },
    {
      label: 'last session',
      content: '12:00 PM, 12/12/2024',
    },
  ];
  readonly paymentMethods = [
    {
      type: 'visa' as const,
      lastFourDigits: '7658',
      expiryDate: '10/2024',
      logoLight:
        'https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg',
      logoDark:
        'https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg',
    },
  ];

  public editDataUser() {
    this.#dialog.open(FormEditDataUserComponent);
  }

  public editPaymentMethods() {
    this.#dialog.open(FormPaymentMethodsComponent, {
      data: this.paymentMethods[0], // Si estás editando un método existente
    });
  }

  addPaymentMethod() {
    const dialogRef = this.#dialog.open(FormPaymentMethodsComponent);

    dialogRef.afterClosed$.subscribe((result) => {
      if (result) {
        // Aquí manejarías la lógica para guardar el nuevo método de pago
        console.log('New payment method:', result);
      }
    });
  }
}
