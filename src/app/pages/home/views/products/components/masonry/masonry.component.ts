import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { IProduct } from '../../../../interfaces/IProduct.interface';
import { NgOptimizedImage } from '@angular/common';
import { CardProductComponent } from '../../../../../../shared/components/card-product/card-product.component';

@Component({
  selector: 'app-masonry',
  standalone: true,
  imports: [NgOptimizedImage, CardProductComponent],
  templateUrl: './masonry.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MasonryComponent {
  products = input.required<IProduct[]>();
}
