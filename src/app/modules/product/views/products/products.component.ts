import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';
import { ApiProductsService } from '../../services/api-products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store/models/App.model';
import { SHOPPING_CART_ACTIONS } from '../../../shopping-cart/store/shoppingCart.actions';
import { Product } from '../../model/Product.model';

@Component({
  selector: 'app-products',
  imports: [
    SidebarComponent,
    ProductCardComponent,
    InfiniteScrollDirective,
    BtnBaseComponent,
  ],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  #store = inject(Store<AppState>);
  #apiProductsService = inject(ApiProductsService);
  ref = viewChild(InfiniteScrollDirective);
  protected readonly products = this.#apiProductsService.getProducts();

  count = 0;

  loadMore() {
    this.count++;

    if (this.count === 3) {
      this.ref()?.disconnect();
    }
  }

  public addProduct(e: Event, product: Product) {
    e.preventDefault();
    e.stopPropagation();
    this.#store.dispatch(
      SHOPPING_CART_ACTIONS.addProduct({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          thumbnail: product.thumbnail,
        },
      }),
    );
  }
}
