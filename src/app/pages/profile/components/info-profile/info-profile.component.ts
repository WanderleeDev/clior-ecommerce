import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { LabelInfoProfileComponent } from '../label-info-profile/label-info-profile.component';
import { CompanySvgComponent } from '../../../../shared/icons/company-svg.component';
import { EmailSvgComponent } from '../../../../shared/icons/email-svg.component';
import { PhoneSvgComponent } from '../../../../shared/icons/phone-svg.component';
import { DeliverySvgComponent } from '../../../../shared/icons/delivery-svg.component';
import { ShopSvgComponent } from '../../../../shared/icons/shop-svg.component';
import { HomeSvgComponent } from '../../../../shared/icons/home-svg.component';
import { IconsType, InfoProfile } from '../../interfaces/InfoProfile.interface';
import { NgComponentOutlet } from '@angular/common';
import { ClockSvgComponent } from '../../../../shared/icons/clock-svg.component';

@Component({
    selector: 'app-info-profile',
    imports: [LabelInfoProfileComponent, NgComponentOutlet],
    templateUrl: './info-profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoProfileComponent {
  readonly dataUser = input.required<InfoProfile[]>();
  protected readonly firstColumn = computed(() => this.dataUser().slice(0, 3));
  protected readonly secondColumn = computed(() => this.dataUser().slice(3));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly iconsProfile: Record<IconsType, any> = {
    'email address': EmailSvgComponent,
    'home address': HomeSvgComponent,
    'delivery address': DeliverySvgComponent,
    'phone number': PhoneSvgComponent,
    'favorite pick-up point': ShopSvgComponent,
    'my company': CompanySvgComponent,
    'last session': ClockSvgComponent,
  };
}
