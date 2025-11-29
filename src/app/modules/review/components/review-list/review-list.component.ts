import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { ReviewComment } from '../../models/review.model';

@Component({
  selector: 'app-review-list',
  imports: [ReviewCardComponent],
  templateUrl: './review-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  readonly reviews = input.required<ReviewComment[]>();
}
