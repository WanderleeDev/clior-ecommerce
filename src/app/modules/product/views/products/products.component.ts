import {
  ChangeDetectionStrategy,
  Component,
  inject,
  resource,
} from '@angular/core';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BtnBaseComponent } from '../../../../shared/base-component/btn-base.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store/models/App.model';
import { SHOPPING_CART_ACTIONS } from '../../../shopping-cart/store/shoppingCart.actions';
import { Product } from '../../model/Product.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  imports: [SidebarComponent, ProductCardComponent, BtnBaseComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  #store = inject(Store<AppState>);
  #productsService = inject(ProductsService);
  productsResource = resource({
    loader: async () => {
      return fetch(
        'https://hashbrown-chat.xamperu33.workers.dev/products',
      ).then((res) => res.json());
    },
    defaultValue: [],
  });
  protected readonly products = toSignal(this.#productsService.getProducts());

  count = 0;

  public addProduct(e: Event, product: Product) {
    this.productsResource.value();
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
