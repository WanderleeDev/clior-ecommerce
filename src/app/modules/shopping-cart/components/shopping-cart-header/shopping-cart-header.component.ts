import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LinkBaseComponent } from '../../../../shared/components/link-base/link-base.component';

@Component({
  selector: 'app-shopping-cart-header',
  imports: [LinkBaseComponent],
  templateUrl: './shopping-cart-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartHeaderComponent {
  readonly totalProducts = input.required<number>();
}
