import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ImageOptimizedComponent } from '../../../../shared/components/image-optimized/image-optimized.component';

@Component({
    selector: 'app-product-image-gallery',
    imports: [ImageOptimizedComponent],
    templateUrl: './product-image-gallery.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'flex flex-col gap-4',
    }
})
export class ProductImageGalleryComponent {
  readonly images = input<string[]>([
    'https://www.dropbox.com/scl/fi/axav5st8h9ul95sr9a2tw/backstage-talks.webp?rlkey=ux75l2jdels4x1ivt45tnjmf0&st=y8fpzj3g&raw=1',
    'https://www.dropbox.com/scl/fi/vwvrsnwnbsng8jac75m7t/backStageRes.webp?rlkey=yam0qsxf243yf3tlzu4i97xcf&raw=1',
    'https://www.dropbox.com/scl/fi/biwmbpeyvr4wqh36h4hz4/webventory.webp?rlkey=37gb6phq9175z5awt1eeu8fw7&st=synqjeql&raw=1',
    'https://www.dropbox.com/scl/fi/86op12i5gaecx3v920vx8/webVentoryRes.webp?rlkey=i2n9vofvpkofrcko2bplfzk0g&raw=1',
  ]);
  readonly title = input.required<string>();
  readonly currentImage = signal(this.images()[0]);

  public selectThumbnail(index: number): void {
    this.currentImage.set(this.images()[index]);
  }
}
