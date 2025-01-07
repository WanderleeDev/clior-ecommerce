import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-user-menu-authenticated',
    imports: [RouterLink],
    templateUrl: './user-menu-authenticated.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuAuthenticatedComponent {
  readonly username = input.required<string>();
}
