import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { ReviewComment } from '../../model/Review.model';

@Component({
  selector: 'app-comment',
  imports: [RatingComponent],
  templateUrl: './comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  readonly comment = input.required<ReviewComment>();
}
