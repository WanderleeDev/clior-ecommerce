import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="overflow-hidden rounded-2xl border border-line bg-surface">
        <img
          [src]="images()[selected()]"
          [alt]="alt()"
          fetchpriority="high"
          width="1024"
          height="1024"
          class="aspect-square w-full object-cover"
        />
      </div>
      @if (images().length > 1) {
        <div class="mt-4 grid grid-cols-4 gap-3">
          @for (thumb of images(); track thumb; let i = $index) {
            <button
              type="button"
              (click)="selected.set(i)"
              [attr.aria-label]="'Ver imagen ' + (i + 1)"
              [attr.aria-pressed]="selected() === i"
              class="overflow-hidden rounded-xl border transition-colors motion-reduce:transition-none"
              [class.border-accent]="selected() === i"
              [class.border-line]="selected() !== i"
            >
              <img
                [src]="thumb"
                [alt]="alt()"
                loading="lazy"
                width="300"
                height="300"
                class="aspect-square w-full object-cover"
              />
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class ProductGallery {
  readonly images = input.required<string[]>();
  readonly alt = input.required<string>();
  protected readonly selected = signal(0);
}
