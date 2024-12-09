import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { ImageErrorService } from '../../services/image-error.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-optimized',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `<figure class="relative">
    <div class="w-full h-48 relative bg-[#CED6D9]">
      @let image = imageBase() || placeholderImage;

      <img
        class="rounded-t-lg w-full h-48 object-contain"
        (error)="handleErrorImage()"
        [ngSrc]="image"
        [alt]="title()"
        fill
      />
    </div>
    <ng-content />
    <figcaption class="sr-only">{{ title() }}</figcaption>
  </figure>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageOptimizedComponent {
  readonly imageBase = model.required<string>();
  readonly title = input.required<string>();
  readonly #imageErrorService = inject(ImageErrorService);
  protected readonly placeholderImage =
    this.#imageErrorService.getPlaceholderImage();

  protected handleErrorImage() {
    this.imageBase.set(this.placeholderImage);
  }
}
