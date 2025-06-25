import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-shopping-cart-footer',
  imports: [CurrencyPipe],
  templateUrl: './shopping-cart-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartFooterComponent {
  readonly totalPrice = input.required<number>();
}
