import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClockSvgComponent } from '../../../../shared/icons/clock-svg.component';
import { PhoneSvgComponent } from '../../../../shared/icons/phone-svg.component';
import { EmailSvgComponent } from '../../../../shared/icons/email-svg.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './contact-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent {
  contactInfo = [
    {
      name: 'phone',
      description: '+1 (234) 567-8900',
      icon: PhoneSvgComponent,
    },
    {
      name: 'email',
      description: 'supporClior.com',
      icon: EmailSvgComponent,
    },
    {
      name: 'working hours',
      description: 'Mon - Fri: 8:00 AM - 10:00 PM EST',
      icon: ClockSvgComponent,
    },
  ];
}
