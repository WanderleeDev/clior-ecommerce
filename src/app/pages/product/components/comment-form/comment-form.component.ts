import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';

export interface Comment {
  author: string;
  date: string;
  content: string;
  rating: number;
}

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './comment-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  // @Output() onSubmit = new EventEmitter<{ rating: number; comment: string }>();

  rating = 0;
  comment = '';

  setRating(value: number) {
    this.rating = value;
  }

  submitComment() {
    if (this.rating && this.comment.trim()) {
      // this.onSubmit.emit({ rating: this.rating, comment: this.comment });
      this.rating = 0;
      this.comment = '';
    }
  }
}
