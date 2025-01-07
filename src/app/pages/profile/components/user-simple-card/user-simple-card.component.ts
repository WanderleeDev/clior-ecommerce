import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
    selector: 'app-user-simple-card',
    templateUrl: './user-simple-card.component.html',
    imports: [AvatarComponent],
    styles: `
    :host {
      display: flex;
      gap: 1rem;
      align-items: end;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSimpleCardComponent {
  readonly username = input.required<string>();
  readonly avatar = input.required<string>();
}
