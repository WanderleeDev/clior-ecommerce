import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductShoppingCart } from '../../store/models/ProductShoppingCart.model';
import { CurrencyPipe } from '@angular/common';
import { TagComponent } from '../../../../shared/components/tag/tag.component';

@Component({
  selector: 'app-shopping-cart-card',
  imports: [CurrencyPipe, TagComponent],
  templateUrl: './shopping-cart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartCardComponent {
  readonly product = input.required<ProductShoppingCart>();
}
