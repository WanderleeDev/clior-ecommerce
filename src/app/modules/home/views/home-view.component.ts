import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Comment } from '../../../shared/interfaces/Comment.interface';
import { BannerVideoComponent } from '../components/banner-video/banner-video.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { BrandInfoComponent } from '../components/brand-info/brand-info.component';
import { CollaboratingBrandsComponent } from '../components/collaborating-brands/collaborating-brands.component';
import { MoreInfoComponent } from '../components/more-info/more-info.component';
import { StoreFrontComponent } from '../components/store-front/store-front.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';

@Component({
  selector: 'app-home-view',
  imports: [
    BannerVideoComponent,
    StoreFrontComponent,
    BrandInfoComponent,
    MoreInfoComponent,
    TestimonialsComponent,
    CollaboratingBrandsComponent,
    LoaderComponent,
  ],
  templateUrl: './home-view.component.ts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeViewComponent {
  readonly #sanitizer = inject(DomSanitizer);
  protected readonly currentTimeVideo = signal(0);
  protected readonly videoUrl = this.#sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/CJQG8qS7oxM?si=KSnd6oed84QEvv7b',
  );

  protected readonly testimonials: Comment[] = [
    {
      content:
        "VitaFit's supplements have been a game-changer for my workout routine. The quality is unmatched, and I've seen remarkable improvements in my energy levels and recovery time.",
      author: 'John Matthews',
      title: 'Fitness Enthusiast',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      content:
        "As a professional trainer, I only recommend the best to my clients. VitaFit's product line consistently meets my high standards for purity and effectiveness.",
      author: 'Sarah Connor',
      title: 'Personal Trainer',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      content:
        'The expert guidance I received helped me choose the perfect supplement stack for my goals. Their customer service is truly exceptional!',
      author: 'Mike Johnson',
      title: 'Amateur Athlete',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  ];
}
