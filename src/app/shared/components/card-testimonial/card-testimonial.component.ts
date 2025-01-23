import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Comment } from '../../interfaces/Comment.interface';

@Component({
  selector: 'app-card-testimonial',
  imports: [],
  templateUrl: './card-testimonial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTestimonialComponent {
  comment = input.required<Comment>();
}
