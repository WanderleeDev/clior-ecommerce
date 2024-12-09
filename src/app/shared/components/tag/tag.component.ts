import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  standalone: true,
  template: `<mark
    class="bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded select-none"
  >
    {{ content() }}
  </mark>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly content = input.required<string>();
}
