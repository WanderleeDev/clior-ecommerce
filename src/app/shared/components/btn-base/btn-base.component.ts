import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type TypeButton = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-btn-base',
  standalone: true,
  template: `<button
    class="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
    [type]="type()"
    [title]="title()"
  >
    <ng-content> Click </ng-content>
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class BtnBaseComponent {
  readonly type = input<TypeButton>('button');
  readonly title = input.required<string>();
}
