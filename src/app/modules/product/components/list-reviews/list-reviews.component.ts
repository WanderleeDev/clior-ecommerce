import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { ReviewComment } from '../../model/Review.model';

@Component({
  selector: 'app-list-reviews',
  imports: [CommentComponent],
  templateUrl: './list-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListReviewsComponent {
  readonly reviews = input.required<ReviewComment[]>();
}
