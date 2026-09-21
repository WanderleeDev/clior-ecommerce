import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-section-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-2 text-sm font-medium text-muted">
      <span
        aria-hidden="true"
        class="inline-block size-2 rounded-full bg-accent"
      ></span>
      {{ label() }}
    </span>
  `,
})
export class SectionTag {
  readonly label = input.required<string>();
}
