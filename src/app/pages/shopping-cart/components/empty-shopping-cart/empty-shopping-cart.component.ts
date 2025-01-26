import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImageOptimizedComponent } from '../../../../shared/components/image-optimized/image-optimized.component';
import { LinkBaseComponent } from '../../../../shared/components/link-base/link-base.component';

type DesignVariant = 'simple' | 'detailed';

@Component({
  selector: 'app-empty-shopping-cart',
  imports: [ImageOptimizedComponent, LinkBaseComponent],
  templateUrl: './empty-shopping-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyShoppingCartComponent {
  variant = input<DesignVariant>('detailed');
  protected readonly imageEmptyCart =
    'https://res.cloudinary.com/dy8gpozi6/image/upload/v1737767343/empty-cart_hhlexk.webp';
}
