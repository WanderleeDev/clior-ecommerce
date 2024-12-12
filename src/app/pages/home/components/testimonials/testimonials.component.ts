import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Comment {
  content: string;
  author: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  comment = input.required<Comment>();
}
