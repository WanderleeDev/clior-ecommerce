import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  contentChildren,
  booleanAttribute,
} from '@angular/core';

/**
 * A reusable Angular component that displays content in an infinite scrolling effect (marquee).
 * It allows duplicating the projected content a specified number of times and handles the case
 * when no content is available.
 *
 * IMPORTANT: Wrap the content in a `ng-template` with the `#content` reference.
 *
 * @example
 * ```html
 * <app-marquee-infinite [repetitions]="3" messageEmpty="No testimonials available">
 *   @for (comment of testimonials(); track $index) {
 *     <ng-template #content>
 *       <app-card-testimonial
 *         class="transition-all hover:-translate-y-2 duration-300 hover:shadow-lg"
 *         [comment]="comment"
 *       />
 *     </ng-template>
 *   }
 * </app-marquee-infinite>
 * ```
 *
 * @example
 * ```html
 * <app-marquee-infinite [repetitions]="5" pauseAnimation reverseAnimation>
 *   <ng-template #content>
 *     <div class="custom-content">Custom content here!</div>
 *   </ng-template>
 * </app-marquee-infinite>
 * ```
 *
 * @remarks
 * This component uses Angular's reactive signals (`input`, `computed`) for efficient state management
 * and `ChangeDetectionStrategy.OnPush` for optimized performance.
 */
@Component({
  selector: 'app-marquee-infinite',
  imports: [NgTemplateOutlet],
  template: `
    <div class="marquee-container">
      <!-- If there is projected content, render it -->
      @if (contentMarquee().length > 0) {
        <div
          class="marquee-content"
          [class.pauseAnimation]="pauseAnimation()"
          [class.reverseAnimation]="reverseAnimation()"
        >
          <!-- Iterate over the range of repetitions -->
          @for (repetition of repetitionRange(); track repetition) {
            <!-- Iterate over the projected content -->
            @for (content of contentMarquee(); track $index) {
              <!-- Render the content using ngTemplateOutlet -->
              <ng-container *ngTemplateOutlet="content" />
            }
          }
        </div>
      } @else {
        <!-- If no content is available, display a message -->
        <p class="text-white bg-gray-800 p-4 w-full font-semibold text-center">
          {{ messageEmpty() }}
        </p>
      }
    </div>
  `,
  styleUrl: './marquee-infinite.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeInfiniteComponent {
  /**
   * Default number of repetitions for the marquee effect.
   * @private
   */
  readonly #DEFAULT_REPETITIONS = 2;

  /**
   * Input signal to pause the marquee animation.
   * @remarks
   * When set to `true` or used as a standalone attribute (`pauseAnimation`), the marquee animation will pause.
   * This input uses `booleanAttribute` to support both boolean values and standalone attributes.
   * @example
   * ```html
   * <app-marquee-infinite pauseAnimation>
   *   <!-- Content -->
   * </app-marquee-infinite>
   * ```
   * @example
   * ```html
   * <app-marquee-infinite [pauseAnimation]="true">
   *   <!-- Content -->
   * </app-marquee-infinite>
   * ```
   */
  readonly pauseAnimation = input(false, { transform: booleanAttribute });

  /**
   * Input signal to reverse the marquee animation.
   * @remarks
   * When set to `true` or used as a standalone attribute (`reverseAnimation`), the marquee animation will play in reverse.
   * This input uses `booleanAttribute` to support both boolean values and standalone attributes.
   * @example
   * ```html
   * <app-marquee-infinite reverseAnimation>
   *   <!-- Content -->
   * </app-marquee-infinite>
   * ```
   * @example
   * ```html
   * <app-marquee-infinite [reverseAnimation]="true">
   *   <!-- Content -->
   * </app-marquee-infinite>
   * ```
   */
  readonly reverseAnimation = input(false, { transform: booleanAttribute });

  /**
   * Signal containing the projected `TemplateRef` elements with the `content` directive.
   * @protected
   * @remarks
   * This signal captures all content projected into the component using the `content` directive.
   */
  protected readonly contentMarquee =
    contentChildren<TemplateRef<unknown>>('content');

  /**
   * Input signal for the message displayed when no content is available.
   * @remarks
   * This input allows customization of the message shown when no content is projected.
   * @example
   * ```html
   * <app-marquee-infinite messageEmpty="No data to display">
   *   <!-- Content -->
   * </app-marquee-infinite>
   * ```
   */
  readonly messageEmpty = input('No content available for now');

  /**
   * Input signal for the number of content repetitions.
   * @remarks
   * This input specifies how many times the projected content should be duplicated.
   * The value is transformed to ensure it is never less than the default number of repetitions.
   * @example
   * ```html
   * <app-marquee-infinite [repetitions]="4">
   *   <!-- Content -->
   * </app-marquee-infinite>
   * ```
   */
  readonly repetitions = input(this.#DEFAULT_REPETITIONS, {
    transform: (value: number) => Math.max(value, this.#DEFAULT_REPETITIONS),
  });

  /**
   * Computed signal that generates an array with the range of repetitions.
   * @protected
   * @remarks
   * This signal creates an array of numbers representing the range of repetitions.
   * For example, if `repetitions` is 3, it will generate `[1, 2, 3]`.
   */
  protected readonly repetitionRange = computed(() => {
    return Array.from({ length: this.repetitions() }, (_, i) => i + 1);
  });
}
