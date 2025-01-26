import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ImageErrorService } from '../../services/image-error.service';
import { NgOptimizedImage } from '@angular/common';

type ObjectFit =
  | 'object-contain'
  | 'object-cover'
  | 'object-fill'
  | 'object-none'
  | 'object-scale-down';

@Component({
  selector: 'app-image-optimized',
  imports: [NgOptimizedImage],
  templateUrl: 'image-optimized.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageOptimizedComponent {
  protected readonly hasLoadError = signal(false);
  readonly imageBase = model.required<string>();
  readonly title = input.required<string>();
  readonly customClass = input<string>();
  readonly fitOption = input<ObjectFit>('object-contain');
  readonly priority = input(false, {
    transform: booleanAttribute,
  });
  readonly bgBase = input(false, {
    transform: booleanAttribute,
  });

  readonly #imageErrorService = inject(ImageErrorService);
  protected readonly placeholderImage =
    this.#imageErrorService.getPlaceholderImage();

  protected handleErrorImage() {
    this.imageBase.set(this.placeholderImage);
  }
}
