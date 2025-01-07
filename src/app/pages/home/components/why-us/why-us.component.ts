import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Comment } from '../testimonials/testimonials.component';
import { SimpleCardComponent } from '../simple-card/simple-card.component';
import { CheckSvgComponent } from '../../../../shared/icons/check-svg.component';
import { CommentSvgComponent } from '../../../../shared/icons/comment-svg.component';
import { DeliverySvgComponent } from '../../../../shared/icons/delivery-svg.component';
import { NgComponentOutlet } from '@angular/common';
import { MoreInfoComponent } from '../more-info/more-info.component';
import { SlideComponent } from '../../../../shared/components/slide/slide.component';

@Component({
  selector: 'app-why-us',
  imports: [
    // TestimonialsComponent,
    // InfiniteSlideComponent,
    SimpleCardComponent,
    NgComponentOutlet,
    MoreInfoComponent,
    SlideComponent,
  ],
  templateUrl: './why-us.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUsComponent {
  protected readonly testimonials: Comment[] = [
    {
      content:
        "VitaFit's supplements have been a game-changer for my workout routine. The quality is unmatched, and I've seen remarkable improvements in my energy levels and recovery time.",
      author: 'John Matthews',
      title: 'Fitness Enthusiast',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      content:
        "As a professional trainer, I only recommend the best to my clients. VitaFit's product line consistently meets my high standards for purity and effectiveness.",
      author: 'Sarah Connor',
      title: 'Personal Trainer',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      content:
        'The expert guidance I received helped me choose the perfect supplement stack for my goals. Their customer service is truly exceptional!',
      author: 'Mike Johnson',
      title: 'Amateur Athlete',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  ];
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
