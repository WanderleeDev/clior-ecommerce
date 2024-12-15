import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RefreshFlowbiteComponent } from '../../shared/directives/refresh-flobite.componet';
import { MetricData } from './interfaces/MetricData.interface';
import { CardMetricProfileComponent } from './components/card-metric-profile/card-metric-profile.component';
import { RouterLink } from '@angular/router';
import { SectionLayoutComponent } from '../../layout/section-layout.component';
import { InfoProfileComponent } from './components/info-profile/info-profile.component';
import { InfoProfile } from './interfaces/InfoProfile.interface';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CardMetricProfileComponent,
    RouterLink,
    SectionLayoutComponent,
    InfoProfileComponent,
    AvatarComponent,
  ],
  templateUrl: './profile.component.html',
  hostDirectives: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent extends RefreshFlowbiteComponent {
  performanceMetrics: MetricData[] = [
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
  userInfo: InfoProfile[] = [
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
}
