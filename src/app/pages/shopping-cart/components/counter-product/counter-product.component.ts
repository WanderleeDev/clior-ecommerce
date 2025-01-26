import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-counter-product',
  imports: [],
  templateUrl: './counter-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterProductComponent { }
