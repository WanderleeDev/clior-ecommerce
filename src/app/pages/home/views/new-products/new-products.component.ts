import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLayoutComponent } from '../../../../layout/main-layout.component';

@Component({
  selector: 'app-new-products',
  standalone: true,
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './new-products.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewProductsComponent { }
