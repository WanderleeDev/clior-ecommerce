import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  contentChildren,
} from '@angular/core';

@Component({
  selector: 'app-marquee-infinite',
  imports: [NgTemplateOutlet],
  template: `
    <div class="marquee-container">
      <div class="marquee-content">
        @for (repetition of repetitionComputed(); track repetition) {
          <ng-container>
            @for (content of contentMarquee(); track $index) {
              <ng-container *ngTemplateOutlet="content" />
            }
          </ng-container>
        }
      </div>
    </div>
  `,
  styleUrl: './marquee-infinite.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeInfiniteComponent {
  readonly contentMarquee = contentChildren<TemplateRef<unknown>>('content', {
    descendants: true,
  });
  readonly #DEFAULT_REPETITIONS = 2;
  readonly repetitions = input(this.#DEFAULT_REPETITIONS, {
    transform: (value: number) => this.#transformInput(value),
  });
  protected readonly repetitionComputed = computed(() =>
    this.#generateContent(this.repetitions()),
  );

  #generateContent(length: number) {
    return Array.from({ length }, (_, i) => i + length);
  }

  #transformInput(value: number) {
    return value <= this.#DEFAULT_REPETITIONS
      ? this.#DEFAULT_REPETITIONS
      : value;
  }

  constructor() {
    console.log(
      '%cDebug: MarqueeInfiniteComponent',
      'background: #222; color: #bada55',
      this.contentMarquee(),
    );
  }
}
