import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
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
    template: `<figure class="relative">
    <div
      class="w-full relative rounded-lg bg-[#CED6D9] {{
        customClass()
      }} overflow-hidden"
    >
      @let image = imageBase() || placeholderImage;

      <img
        class="{{ fitOption() }}"
        (error)="handleErrorImage()"
        [ngSrc]="image"
        [alt]="title()"
        fill
      />
    </div>
    <ng-content />
    <figcaption class="sr-only">{{ title() }}</figcaption>
  </figure>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageOptimizedComponent {
  readonly customClass = input<string>();
  readonly imageBase = model.required<string>();
  readonly title = input.required<string>();
  readonly fitOption = input<ObjectFit>('object-contain');

  readonly #imageErrorService = inject(ImageErrorService);
  protected readonly placeholderImage =
    this.#imageErrorService.getPlaceholderImage();

  protected handleErrorImage() {
    this.imageBase.set(this.placeholderImage);
  }
}
