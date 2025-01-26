import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  selectProducts,
  totalPrice,
  totalProducts,
} from '../../core/store/shoppingCart/shoppingCart.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/models/App.model';
import { LetDirective, PushPipe } from '@ngrx/component';
import { SHOPPING_CART_ACTIONS } from '../../core/store/shoppingCart/shoppingCart.actions';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { EmptyShoppingCartComponent } from './components/empty-shopping-cart/empty-shopping-cart.component';
import { DividerComponent } from '../../shared/components/divider/divider.component';
import { BtnBaseComponent } from '../../shared/components/btn-base/btn-base.component';
import { ShoppingCartCardComponent } from './components/shopping-cart-card/shopping-cart-card.component';
import { ShoppingCartHeaderComponent } from './components/shopping-cart-header/shopping-cart-header.component';
import { startWith } from 'rxjs';
import { ShoppingCartFooterComponent } from './components/shopping-cart-footer/shopping-cart-footer.component';

type ShoppingCartAction = 'decrement' | 'increment';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    EmptyShoppingCartComponent,
    ShoppingCartCardComponent,
    ShoppingCartFooterComponent,
    AlertComponent,
    LetDirective,
    PushPipe,
    DividerComponent,
    BtnBaseComponent,
    ShoppingCartHeaderComponent,
  ],
  templateUrl: './shopping-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShoppingCartComponent {
  readonly #store: Store<AppState> = inject(Store);
  protected readonly myProducts$ = this.#store.select(selectProducts);
  protected readonly totalPrice$ = this.#store.select(totalPrice);
  protected readonly totalProducts$ = this.#store
    .select(totalProducts)
    .pipe(startWith(0));

  public removeProduct(id: string) {
    this.#store.dispatch(SHOPPING_CART_ACTIONS.removeProduct({ id }));
  }

  public clearCart() {
    this.#store.dispatch(SHOPPING_CART_ACTIONS.clearShoppingCart());
  }

  public updateQuantity(id: string, action: ShoppingCartAction = 'increment') {
    if (action === 'increment') {
      return;
    }

    if (action === 'decrement') {
      return;
    }
  }
}
