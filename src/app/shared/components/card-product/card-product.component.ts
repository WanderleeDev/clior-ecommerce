import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductInfo } from '../../../pages/product/model/Product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [StarRatingComponent, CurrencyPipe, RouterLink, NgOptimizedImage],
  templateUrl: './card-product.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProductComponent {
  productData = input.required<ProductInfo>();
}
