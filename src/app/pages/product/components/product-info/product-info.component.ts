import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { ProductInfo } from '../../model/Product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [RatingComponent, CurrencyPipe],
  templateUrl: './product-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-2',
  },
})
export class ProductInfoComponent {
  readonly productInfo = input.required<ProductInfo>();
}
