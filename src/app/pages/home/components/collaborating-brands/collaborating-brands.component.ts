import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';
import { MarqueeInfiniteComponent } from '../../../../shared/components/marquee-infinite/marquee-infinite.component';
import { Logo } from '../../../contact/interfaces/Logo.interface';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-collaborating-brands',
  imports: [SectionLayoutComponent, MarqueeInfiniteComponent, NgOptimizedImage],
  templateUrl: './collaborating-brands.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaboratingBrandsComponent {
  brands: Logo[][] = [
    [
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f542556_Frame%2018608.svg',
        alt: 'booking',
      },
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f542559_deloitte.svg',
        alt: 'Deloitte',
      },
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f542554_Amazon%20logo.svg',
        alt: 'Amazon',
      },
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f542555_Frame%2018610.svg',
        alt: 'disney',
      },
    ],
    [
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f542558_Frame%2018611.svg',
        alt: 'microsoft',
      },
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f542557_Frame%2018612.svg',
        alt: 'accenture',
      },
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f54255a_EY.svg',
        alt: 'EY',
      },
      {
        src: 'https://cdn.prod.website-files.com/65aebad6eb424b0209ede842/65afaf92263c2c5d3f54255d_toyota.svg',
        alt: 'Toyota',
      },
    ],
  ];
}
