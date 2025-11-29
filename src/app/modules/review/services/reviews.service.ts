import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReviewComment, ReviewDTO } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  #mockReviews: ReviewComment[] = [
    {
      username: 'John Doe',
      date: '2 days ago',
      comment:
        'Amazing product! The display is incredibly crisp and the performance is outstanding. Highly recommend for both professional work and casual use.',
      rating: 5,
    },
    {
      username: 'Sarah Smith',
      date: '1 week ago',
      comment:
        'Beautiful design and great performance. The only downside is the limited port selection, but overall very satisfied with the purchase.',
      rating: 4,
    },
    {
      username: 'Mike Johnson',
      date: '2 weeks ago',
      comment:
        'The M1 chip is a game changer. Everything runs smoothly and the battery life is incredible. Worth every penny!',
      rating: 5,
    },
  ];

  public getReviewsByProductId(productId: string): Observable<ReviewComment[]> {
    return of(this.#mockReviews);
  }

  public addReview(
    productId: string,
    review: ReviewDTO,
  ): Observable<ReviewComment> {
    const newReview: ReviewComment = {
      username: 'You',
      date: 'Just now',
      comment: review.comment,
      rating: review.rating,
    };

    this.#mockReviews.unshift(newReview);

    return of(newReview);
  }
}
