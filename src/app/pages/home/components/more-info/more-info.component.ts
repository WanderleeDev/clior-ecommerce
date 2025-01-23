import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PhoneSvgComponent } from '../../../../shared/icons/phone-svg.component';
import { EmailSvgComponent } from '../../../../shared/icons/email-svg.component';
import { NgComponentOutlet } from '@angular/common';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';

@Component({
  selector: 'app-more-info',
  imports: [NgComponentOutlet, SectionLayoutComponent],
  templateUrl: './more-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreInfoComponent {
  protected readonly infoContact = [
    {
      text: '+1 (234) 567-8900',
      icon: PhoneSvgComponent,
    },
    {
      text: 'support.com',
      icon: EmailSvgComponent,
    },
  ];

  protected readonly businessHours = [
    'Monday - Friday: 8:00 AM - 10:00 PM EST',
    'Saturday: 9:00 AM - 8:00 PM EST',
    'Sunday: 10:00 AM - 6:00 PM EST',
  ];
}
