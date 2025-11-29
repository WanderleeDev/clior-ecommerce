export interface Review {
  username: string;
  id: string;
  comment: string;
  rating: number;
}

export interface ReviewComment extends Pick<
  Review,
  'rating' | 'comment' | 'username'
> {
  date: string;
}

export type ReviewDTO = Pick<Review, 'comment' | 'rating'>;
