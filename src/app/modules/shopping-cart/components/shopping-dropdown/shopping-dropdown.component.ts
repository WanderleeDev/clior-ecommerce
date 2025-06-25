import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DropdownComponent } from '../../../../shared/ui/dropdown/dropdown.component';
import { ShoppingCarSvgComponent } from '../../../../shared/icons/shopping-car-svg.component';
import { LinkBaseComponent } from '../../../../shared/components/link-base/link-base.component';
import { EmptyShoppingCartComponent } from '../empty-shopping-cart/empty-shopping-cart.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store/models/App.model';
import { selectProducts } from '../../store/shoppingCart.selectors';
import { TagComponent } from '../../../../shared/components/tag/tag.component';

@Component({
  selector: 'app-shopping-dropdown',
  imports: [
    DropdownComponent,
    ShoppingCarSvgComponent,
    LinkBaseComponent,
    EmptyShoppingCartComponent,
    TagComponent,
  ],
  templateUrl: './shopping-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingDropdownComponent {
  readonly #store: Store<AppState> = inject(Store);
  readonly products = this.#store.selectSignal(selectProducts);
}
