import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DropdownComponent } from '../../../../shared/ui/dropdown/dropdown.component';
import { ShoppingCarSvgComponent } from '../../../../shared/icons/shopping-car-svg.component';
import { LinkBaseComponent } from '../../../../shared/components/link-base/link-base.component';
import { EmptyShoppingCartComponent } from '../empty-shopping-cart/empty-shopping-cart.component';

@Component({
  selector: 'app-shopping-dropdown',
  imports: [
    DropdownComponent,
    ShoppingCarSvgComponent,
    LinkBaseComponent,
    EmptyShoppingCartComponent,
  ],
  templateUrl: './shopping-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingDropdownComponent {
  products = [];
}
