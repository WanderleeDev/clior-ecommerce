import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';

export interface Comment {
  author: string;
  date: string;
  content: string;
  rating: number;
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './comment.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  readonly comment = input.required<Comment>();
}
