import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { ReviewsService } from '../../../review/services/reviews.service';
import { ReviewFormComponent } from '../../../review/components/review-form/review-form.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ProductsService } from '../../services/products.service';
import { ProductImageGalleryComponent } from '../../components/product-image-gallery/product-image-gallery.component';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { ProductFormOrderComponent } from '../../components/product-form-order/product-form-order.component';
import { ProductInfoComponent } from '../../components/product-info/product-info.component';
import { SectionLayoutComponent } from '../../../../layout/section-layout.component';
import { ReviewComment } from '../../../review/models/review.model';
import { ReviewListComponent } from '../../../review/components/review-list/review-list.component';
import { NotFound } from '../../../../shared/components/not found/not-found.component';
import { ButtonFlowbiteComponent } from '../../../../shared/components/button-flowbite/button-flowbite.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-overview',
  imports: [
    ReviewFormComponent,
    LoaderComponent,
    ProductImageGalleryComponent,
    TagComponent,
    ProductFormOrderComponent,
    ProductInfoComponent,
    SectionLayoutComponent,
    ReviewListComponent,
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

  readonly #reviewsService = inject(ReviewsService);
  protected readonly reviews = signal<ReviewComment[]>([]);

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.#reviewsService.getReviewsByProductId(id).subscribe((reviews) => {
          this.reviews.set(reviews);
        });
      }
    });
  }

  public addComment(data: { rating: number; comment: string }) {
    const newReview: ReviewComment = {
      username: 'You',
      date: 'Just now',
      comment: data.comment,
      rating: data.rating,
    };

    this.reviews.update((prev) => [newReview, ...prev]);
    this.#reviewsService.addReview(this.id(), data).subscribe();
  }

  public navigateToProducts() {
    this.#router.navigate(['/products']);
  }
}
