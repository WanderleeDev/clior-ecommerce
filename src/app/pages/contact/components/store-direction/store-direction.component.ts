import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StoreLocation } from '../../interfaces/Store.interface';
import { ClockSvgComponent } from '../../../../shared/icons/clock-svg.component';
import { PhoneSvgComponent } from '../../../../shared/icons/phone-svg.component';
import { HomeSvgComponent } from '../../../../shared/icons/home-svg.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
    selector: 'app-store-direction',
    imports: [NgComponentOutlet],
    templateUrl: './store-direction.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreDirectionComponent {
  readonly store = input.required<StoreLocation>();
  protected readonly iconProps = { size: 16 };
  readonly icons = {
    clock: ClockSvgComponent,
    phone: PhoneSvgComponent,
    home: HomeSvgComponent,
  };
}
