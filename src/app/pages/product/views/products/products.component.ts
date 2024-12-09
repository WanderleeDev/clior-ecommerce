import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SidebarComponent } from '../../../../shared/ui/sidebar/sidebar.component';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './products.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {}
