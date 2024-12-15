import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { DatePipe, NgComponentOutlet, PercentPipe } from '@angular/common';
import { ClockSvgComponent } from '../../../../shared/icons/clock-svg.component';
import { MetricData, MetricType } from '../../interfaces/MetricData.interface';
import { ArrowUpSvgComponent } from '../../../../shared/icons/arrow-up-svg.component';
import { HeartSvgComponent } from '../../../../shared/icons/heart-svg.component';
import { StarEmptySvgComponent } from '../../../../shared/icons/star-empty-svg.component';
import { ShoppingCarSvgComponent } from '../../../../shared/icons/shopping-car-svg.component';
import { ReturnSvgComponent } from '../../../../shared/icons/return-svg.component';

@Component({
  selector: 'app-card-metric-profile',
  standalone: true,
  imports: [
    TagComponent,
    PercentPipe,
    ClockSvgComponent,
    DatePipe,
    ArrowUpSvgComponent,
    NgComponentOutlet,
  ],
  templateUrl: './card-metric-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMetricProfileComponent {
  readonly metric = input.required<MetricData>();
  // readonly metricType = input<MetricType>();
  readonly status = computed(() =>
    this.metric().status === 'up' ? '#014737' : '#771D1D',
  );
  protected readonly iconProps = { size: 30 };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly icons: Record<MetricType, any> = {
    orders: ShoppingCarSvgComponent,
    reviews: StarEmptySvgComponent,
    favorites: HeartSvgComponent,
    returns: ReturnSvgComponent,
  };

  readonly typeMetric: Record<MetricType, string> = {
    orders: 'Orders made',
    reviews: 'Reviews added',
    favorites: 'Favorite products added',
    returns: 'Returns made',
  };
}
