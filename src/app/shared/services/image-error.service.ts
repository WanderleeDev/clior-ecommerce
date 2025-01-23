import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageErrorService {
  // 'assets/clior-placeholder.webp'
  readonly #placeholderImage =
    'https://res.cloudinary.com/dy8gpozi6/image/upload/v1733777631/placeholder_q3etpx.webp';

  public getPlaceholderImage() {
    return this.#placeholderImage;
  }
}
