import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../../model/Product.model';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { RouterLink } from '@angular/router';
import { ImageOptimizedComponent } from '../../../../shared/components/image-optimized/image-optimized.component';

@Component({
    selector: 'app-product-card',
    imports: [
        TagComponent,
        CurrencyPipe,
        RatingComponent,
        BtnBaseComponent,
        PercentPipe,
        RouterLink,
        ImageOptimizedComponent,
    ],
    templateUrl: './product-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  protected addToCart(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
}
