import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [CommentComponent, CommentFormComponent, RatingComponent],
  templateUrl: './product-overview.component.html',
  host: {
    class: 'py-10 container mx-auto block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductOverviewComponent {
  product = {
    id: 1,
    title:
      'Apple iMac 24" All-In-One Computer, Apple M1, 8GB RAM, 256GB SSD, Mac OS, Pink',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697301104671',
    price: 1249.99,
  };

  selectedColor = 'pink';
  selectedStorage = '256GB';

  comments = [
    {
      author: 'John Doe',
      date: '2 days ago',
      content:
        'Amazing product! The display is incredibly crisp and the performance is outstanding. Highly recommend for both professional work and casual use.',
      rating: 5,
    },
    {
      author: 'Sarah Smith',
      date: '1 week ago',
      content:
        'Beautiful design and great performance. The only downside is the limited port selection, but overall very satisfied with the purchase.',
      rating: 4,
    },
    {
      author: 'Mike Johnson',
      date: '2 weeks ago',
      content:
        'The M1 chip is a game changer. Everything runs smoothly and the battery life is incredible. Worth every penny!',
      rating: 5,
    },
  ];

  addComment(data: { rating: number; comment: string }) {
    this.comments.unshift({
      author: 'You',
      date: 'Just now',
      content: data.comment,
      rating: data.rating,
    });
  }
}
