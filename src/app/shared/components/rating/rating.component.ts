import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  readonly sizeStar = input(18);
  readonly isReadonly = input(false);
  readonly rating = model.required<number>();
  readonly backgroundStar = input('#dcdcdc');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly arrayStars = Array.from({ length: 5 }, (_, i) => i + 1);

  public viewRating(rating: number): void {
    if (this.isReadonly() || rating === this.rating()) return;

    this.rating.set(rating);
  }
}
