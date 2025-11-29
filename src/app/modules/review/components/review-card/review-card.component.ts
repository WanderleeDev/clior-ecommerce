import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { ReviewComment } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  imports: [RatingComponent],
  templateUrl: './review-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
  readonly comment = input.required<ReviewComment>();
}
