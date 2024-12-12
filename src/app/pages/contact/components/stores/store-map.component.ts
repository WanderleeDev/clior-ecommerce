import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-store-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="aspect-w-16 aspect-h-9">
        <iframe
          width="100%"
          height="400"
          style="border:0"
          loading="lazy"
          allowfullscreen
          [src]="safeUrl"
          class="rounded-lg"
        >
        </iframe>
      </div>
    </div>
  `,
})
export class StoreMapComponent {
  readonly #sanitizer = inject(DomSanitizer);
  text = this.#sanitizer.sanitize;
  readonly safeUrl = this.#sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596698663!2d-74.25987368715491!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1639058644123!5m2!1sen!2s',
  );
}
