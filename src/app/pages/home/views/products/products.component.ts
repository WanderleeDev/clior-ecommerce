import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import MasonryComponent from './components/masonry/masonry.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpService } from '../../../../core/services/http.service';
import { IProduct } from '../../interfaces/IProduct.interface';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { GridImageSkeletonComponent } from '../../../../shared/skeleton/grid-image-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MasonryComponent, LoaderComponent, GridImageSkeletonComponent],
  templateUrl: './products.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  #productService = inject(HttpService);
  products = toSignal<IProduct[]>(
    this.#productService.fetchData('https://fakestoreapi.com/products')
  );
}
