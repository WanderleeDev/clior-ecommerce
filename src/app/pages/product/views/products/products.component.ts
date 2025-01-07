import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';
import { ApiProductsService } from '../../services/api-products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { RefreshFlowbiteComponent } from '../../../../shared/directives/refresh-flobite.componet';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';

@Component({
    selector: 'app-products',
    imports: [SidebarComponent, ProductCardComponent, InfiniteScrollDirective],
    templateUrl: './products.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductsComponent extends RefreshFlowbiteComponent {
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
}
