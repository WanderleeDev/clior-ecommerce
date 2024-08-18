import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { BannerVideoComponent } from '../../../../shared/components/banner-video/banner-video.component';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [CommonModule, RouterLink, BannerVideoComponent],
  templateUrl: './entry.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EntryComponent {
  currentTimeVideo = signal(0);
  #sanitizer = inject(DomSanitizer);
  videoUrl = this.#sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/CJQG8qS7oxM?si=KSnd6oed84QEvv7b'
  );
}
