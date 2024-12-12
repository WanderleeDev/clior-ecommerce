import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ApiProductsService } from '../../services/api-products.service';
import { Product } from '../../model/Product.model';
import { ProductImageGalleryComponent } from '../../components/product-inage-gallery/product-image-gallery.component';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { ProductFormOrderComponent } from '../../components/product-form-order/product-form-order.component';
import { ProductInfoComponent } from '../../components/product-info/product-info.component';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [
    CommentComponent,
    CommentFormComponent,
    LoaderComponent,
    ProductImageGalleryComponent,
    TagComponent,
    ProductFormOrderComponent,
    ProductInfoComponent,
    SectionLayoutComponent,
  ],
  templateUrl: './product-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductOverviewComponent implements OnInit {
  protected readonly id = input.required<string>();
  protected readonly productData = signal<Product | null>(null);
  readonly #productService = inject(ApiProductsService);
  product = {
    id: 1,
    title:
      'Apple iMac 24" All-In-One Computer, Apple M1, 8GB RAM, 256GB SSD, Mac OS, Pink',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697301104671',
    price: 1249.99,
  };

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

  ngOnInit(): void {
    this.productData.set(this.#productService.getProductById(this.id()));
  }

  addComment(data: { rating: number; comment: string }) {
    this.comments.unshift({
      author: 'You',
      date: 'Just now',
      content: data.comment,
      rating: data.rating,
    });
  }
}
