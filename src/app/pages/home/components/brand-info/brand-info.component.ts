import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';
import { SimpleCardComponent } from '../../../../shared/components/simple-card/simple-card.component';
import { CheckSvgComponent } from '../../../../shared/icons/check-svg.component';
import { CommentSvgComponent } from '../../../../shared/icons/comment-svg.component';
import { DeliverySvgComponent } from '../../../../shared/icons/delivery-svg.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-brand-info',
  imports: [SectionLayoutComponent, SimpleCardComponent, NgComponentOutlet],
  templateUrl: './brand-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandInfoComponent {
  protected readonly cards = [
    {
      title: 'Premium Quality',
      content:
        'All our supplements undergo rigorous testing and are manufactured in FDA-approved facilities.',
      icon: CheckSvgComponent,
    },
    {
      title: 'Expert Guidance',
      content:
        'Our nutrition experts are available 24/7 to help you choose the right supplements.',
      icon: CommentSvgComponent,
    },
    {
      title: 'Fast Delivery',
      content:
        'Free shipping on orders over $50 and same-day delivery in selected areas.',
      icon: DeliverySvgComponent,
    },
  ];
}
