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
  imports: [],
  templateUrl: './testimonials.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  comment = input.required<Comment>();
}
