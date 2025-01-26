import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductShoppingCart } from '../../../../core/store/models/ShoppingCart.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart-card',
  imports: [CurrencyPipe],
  templateUrl: './shopping-cart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartCardComponent {
  readonly product = input.required<ProductShoppingCart>();
}
