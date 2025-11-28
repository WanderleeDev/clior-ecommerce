import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  resource,
} from '@angular/core';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ProductsService } from '../../services/products.service';
import { ProductImageGalleryComponent } from '../../components/product-inage-gallery/product-image-gallery.component';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { ProductFormOrderComponent } from '../../components/product-form-order/product-form-order.component';
import { ProductInfoComponent } from '../../components/product-info/product-info.component';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';
import { ReviewComment } from '../../model/Review.model';
import { ListReviewsComponent } from '../../components/list-reviews/list-reviews.component';
import { NotFound } from '../../../../shared/components/not found/not-found.component';
import { ButtonFlowbiteComponent } from '../../../../shared/components/button-flowbite/button-flowbite.component';
import { Router } from '@angular/router';

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
    NotFound,
    ButtonFlowbiteComponent,
  ],
  templateUrl: './product-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductOverviewComponent {
  protected readonly id = input.required<string>();
  readonly #productService = inject(ProductsService);
  readonly #router = inject(Router);
  readonly productResource = resource({
    params: () => this.id(),
    loader: async ({ params }) => this.#productService.getProductById(params),
  });

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

  public addComment(data: { rating: number; comment: string }) {
    this.comments.unshift({
      username: 'You',
      date: 'Just now',
      comment: data.comment,
      rating: data.rating,
    });
  }

  public navigateToProducts() {
    this.#router.navigate(['/products']);
  }
}
