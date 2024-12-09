import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Comment,
  TestimonialsComponent,
} from '../testimonials/testimonials.component';

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [TestimonialsComponent],
  templateUrl: './why-us.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUsComponent {
  currentSlide = 0;
  testimonials: Comment[] = [
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

  prevSlide() {
    this.currentSlide =
      this.currentSlide > 0
        ? this.currentSlide - 1
        : this.testimonials.length - 1;
  }

  nextSlide() {
    this.currentSlide =
      this.currentSlide < this.testimonials.length - 1
        ? this.currentSlide + 1
        : 0;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
