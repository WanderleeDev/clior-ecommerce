import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Comment } from '../../../../shared/interfaces/Comment.interface';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';
import { MarqueeInfiniteComponent } from '../../../../shared/components/marquee-infinite/marquee-infinite.component';
import { CardTestimonialComponent } from '../../../../shared/components/card-testimonial/card-testimonial.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    SectionLayoutComponent,
    MarqueeInfiniteComponent,
    CardTestimonialComponent,
  ],
  templateUrl: './testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  readonly testimonials = input.required<Comment[]>();
}
