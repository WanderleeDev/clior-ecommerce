import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-product-form-order',
    imports: [],
    templateUrl: './product-form-order.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormOrderComponent {
  selectedColor = 'pink';
  selectedStorage = '256GB';
}
