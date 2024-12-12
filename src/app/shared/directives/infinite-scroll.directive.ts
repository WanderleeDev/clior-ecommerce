import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';

/**
 * @description
 * A directive that emits an event when the user scrolls to the bottom of an element.
 * Uses the Intersection Observer API to detect when the element becomes visible.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <div
 *   appInfiniteScroll
 *   (action)="loadMore()">
 *   <!-- Content -->
 * </div>
 *
 * <!-- Advanced usage with all options -->
 * <div
 *   appInfiniteScroll
 *   (action)="loadMore()"
 *   [threshold]="0.5"
 *   [rootMargin]="'20px'">
 *   <!-- Content -->
 * </div>
 * ```
 *
 * @example
 * ```typescript
 * export class MyListComponent {
 *   @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
 *   items: string[] = [];
 *   isLoading = false;
 *
 *   async loadMore() {
 *     if (this.isLoading) return;
 *
 *     this.isLoading = true;
 *     try {
 *       const newItems = await this.fetchMoreItems();
 *       this.items.push(...newItems);
 *     } finally {
 *       this.isLoading = false;
 *     }
 *   }
 * }
 * ```
 *
 * @usageNotes
 * ### Inputs
 * - `threshold`: A number between 0 and 1 indicating at what percentage of the target's
 *    visibility the observer's callback should be executed. Default is 0.1 (10%)
 * - `rootMargin`: String with units (like CSS margin) to grow/shrink the root's bounding box
 *    before computing intersections. Default is '0px'
 * - `root`: The element that is used as the viewport for checking visibility of the target.
 *    Must be an ancestor of the target. Default is null (browser viewport)
 *
 * ### Outputs
 * - `action`: Emits when the element intersects with the viewport according to the threshold
 *
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  /** Reference to the host element */
  readonly #ref = inject(ElementRef<HTMLElement>);

  /**
   * The threshold at which the action should be triggered.
   * Value between 0 and 1, where 0 means "as soon as even one pixel is visible"
   * and 1 means "when all pixels are visible"
   */
  readonly threshold = input<number>(0.5);

  /**
   * The root margin for the IntersectionObserver.
   * This allows for a small buffer zone around the target element.
   */
  readonly rootMargin = input<string>('0px');

  /**
   * Event emitted when the element intersects with the viewport
   * according to the threshold value
   */
  readonly action = output<void>();

  /** The IntersectionObserver instance */
  readonly #observer: IntersectionObserver;

  constructor() {
    this.#observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin: this.rootMargin(),
        threshold: this.threshold(),
      },
    );
  }

  /**
   * Initializes the directive by starting to observe the host element
   */
  ngOnInit() {
    this.#observer.observe(this.#ref.nativeElement);
  }

  /**
   * Handles intersection events from the IntersectionObserver
   * @param entries - Array of IntersectionObserverEntry objects
   */
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.action.emit();

        console.log(
          '%cInfinite Scroll: Intersection detected',
          'background: #1e40af; color: #93c5fd; padding: 2px 5px; border-radius: 4px; font-weight: bold;',
        );
      }
    });
  }

  /**
   * Disconnects the observer from the target element
   */
  public disconnect(): void {
    this.#observer.disconnect();
  }

  /**
   * Cleanup by disconnecting the observer when the directive is destroyed
   */
  ngOnDestroy() {
    this.disconnect();
  }
}
