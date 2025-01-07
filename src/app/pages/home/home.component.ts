import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { BannerVideoComponent } from '../../shared/components/banner-video/banner-video.component';
import { DomSanitizer } from '@angular/platform-browser';
import { WhyUsComponent } from './components/why-us/why-us.component';
import { StoreFrontComponent } from './components/store-front/store-front.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
    selector: 'app-home',
    imports: [
        BannerVideoComponent,
        WhyUsComponent,
        StoreFrontComponent,
        LoaderComponent,
    ],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {
  readonly #sanitizer = inject(DomSanitizer);
  protected readonly currentTimeVideo = signal(0);
  protected readonly videoUrl = this.#sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/CJQG8qS7oxM?si=KSnd6oed84QEvv7b',
  );
}
