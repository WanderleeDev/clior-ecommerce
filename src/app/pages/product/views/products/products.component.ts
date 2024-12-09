import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';
import { ApiProductsService } from '../../services/api-products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SidebarComponent, ProductCardComponent],
  templateUrl: './products.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  #apiProductsService = inject(ApiProductsService);
  protected readonly products = this.#apiProductsService.getProducts();
}
