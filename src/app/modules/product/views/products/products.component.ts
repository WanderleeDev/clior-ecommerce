import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store/models/App.model';
import { SHOPPING_CART_ACTIONS } from '../../../shopping-cart/store/shoppingCart.actions';
import { Product } from '../../model/Product.model';

@Component({
  selector: 'app-products',
  imports: [SidebarComponent, ProductCardComponent, BtnBaseComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  #store = inject(Store<AppState>);
  #productsService = inject(ProductsService);
  protected readonly products = this.#productsService.getProducts();

  count = 0;

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
