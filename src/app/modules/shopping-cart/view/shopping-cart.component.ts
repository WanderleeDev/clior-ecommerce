import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/models/App.model';
import { BtnBaseComponent } from '../../../shared/base-component/btn-base.component';
import { DividerComponent } from '../../../shared/components/divider/divider.component';
import { EmptyShoppingCartComponent } from '../components/empty-shopping-cart/empty-shopping-cart.component';
import { ShoppingCartCardComponent } from '../components/shopping-cart-card/shopping-cart-card.component';
import { ShoppingCartFooterComponent } from '../components/shopping-cart-footer/shopping-cart-footer.component';
import { ShoppingCartHeaderComponent } from '../components/shopping-cart-header/shopping-cart-header.component';
import { SHOPPING_CART_ACTIONS } from '../store/shoppingCart.actions';
import {
  selectProducts,
  selectTotalPriceProducts,
  selectQuantityProducts,
} from '../store/shoppingCart.selectors';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    EmptyShoppingCartComponent,
    ShoppingCartCardComponent,
    ShoppingCartFooterComponent,
    DividerComponent,
    BtnBaseComponent,
    ShoppingCartHeaderComponent,
  ],
  templateUrl: './shopping-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShoppingCartComponent {
  readonly #store: Store<AppState> = inject(Store);
  protected readonly products = this.#store.selectSignal(selectProducts);
  protected readonly totalPrice = this.#store.selectSignal(
    selectTotalPriceProducts,
  );
  protected readonly totalProducts = this.#store.selectSignal(
    selectQuantityProducts,
  );

  public incrementProduct(id: string): void {
    this.#store.dispatch(
      SHOPPING_CART_ACTIONS.incrementProductQuantity({ id }),
    );
  }

  public decrementProduct(id: string): void {
    this.#store.dispatch(SHOPPING_CART_ACTIONS.decreaseProductQuantity({ id }));
  }

  public removeProduct(id: string): void {
    this.#store.dispatch(SHOPPING_CART_ACTIONS.removeProduct({ id }));
  }

  public clearCart(): void {
    this.#store.dispatch(SHOPPING_CART_ACTIONS.clearShoppingCart());
  }
}
