import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { ArrowDownSvgComponent } from '../../icons/arrow-down-svg.component';
import { UserMenuAuthenticatedComponent } from './components/user-menu-authenticated/user-menu-authenticated.component';
import { UserMenuUnauthenticatedComponent } from './components/user-menu-unauthenticated/user-menu-unauthenticated.component';
import { EmptyUserSvgComponent } from '../../icons/empty-user-svg.component';

@Component({
  selector: 'app-dropdown-user',
  standalone: true,
  imports: [
    AvatarComponent,
    ArrowDownSvgComponent,
    UserMenuAuthenticatedComponent,
    UserMenuUnauthenticatedComponent,
    EmptyUserSvgComponent,
  ],
  templateUrl: './dropdown-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hidden relative md:block',
  },
})
export class DropdownUserComponent {
  readonly isLogged = input.required<boolean>();
  readonly username = input.required<string>();
  protected readonly isViewDropdownMenu = signal(false);

  public toggleDropdownMenu(): void {
    this.isViewDropdownMenu.update((prev) => !prev);
  }
}
