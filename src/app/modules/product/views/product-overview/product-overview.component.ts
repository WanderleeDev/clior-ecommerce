import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../model/Product.model';
import { ProductImageGalleryComponent } from '../../components/product-inage-gallery/product-image-gallery.component';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { ProductFormOrderComponent } from '../../components/product-form-order/product-form-order.component';
import { ProductInfoComponent } from '../../components/product-info/product-info.component';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';
import { ReviewComment } from '../../model/Review.model';
import { ListReviewsComponent } from '../../components/list-reviews/list-reviews.component';

@Component({
  selector: 'app-product-overview',
  imports: [
    CommentFormComponent,
    LoaderComponent,
    ProductImageGalleryComponent,
    TagComponent,
    ProductFormOrderComponent,
    ProductInfoComponent,
    SectionLayoutComponent,
    ListReviewsComponent,
  ],
  templateUrl: './product-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductOverviewComponent implements OnInit {
  protected readonly id = input.required<string>();
  protected readonly productData = signal<Product | null>(null);
  readonly #productService = inject(ProductsService);
  product = {
    id: 1,
    title:
      'Apple iMac 24" All-In-One Computer, Apple M1, 8GB RAM, 256GB SSD, Mac OS, Pink',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697301104671',
    price: 1249.99,
  };

  protected readonly comments: ReviewComment[] = [
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

  ngOnInit(): void {
    this.productData.set(this.#productService.getProductById(this.id()));
  }

  addComment(data: { rating: number; comment: string }) {
    this.comments.unshift({
      username: 'You',
      date: 'Just now',
      comment: data.comment,
      rating: data.rating,
    });
  }
}
