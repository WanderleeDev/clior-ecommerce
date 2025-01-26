import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { EmptyUserSvgComponent } from '../../icons/empty-user-svg.component';
import { ArrowDownSvgComponent } from '../../icons/arrow-down-svg.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/models/App.model';
import { selectIsAuthenticated } from '../../../core/store/auth/auth.selectors';
import { LetDirective } from '@ngrx/component';
import { BtnBaseComponent } from '../btn-base/btn-base.component';
import { DividerComponent } from '../divider/divider.component';
import { RouterLink } from '@angular/router';
import { GoogleSvgComponent } from '../../icons/google-svg.component';
import { AppleSvgComponent } from '../../icons/apple-svg.component';
import { NgComponentOutlet } from '@angular/common';
import { LinkBaseComponent } from '../link-base/link-base.component';
import { selectUserState } from '../../../core/store/user/user.seletors';

@Component({
  selector: 'app-dropdown-user',
  imports: [
    DropdownComponent,
    AvatarComponent,
    EmptyUserSvgComponent,
    ArrowDownSvgComponent,
    BtnBaseComponent,
    DividerComponent,
    LetDirective,
    RouterLink,
    NgComponentOutlet,
    LinkBaseComponent,
  ],
  templateUrl: './dropdown-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownUserComponent {
  readonly #store: Store<AppState> = inject(Store);
  protected readonly isLogged$ = this.#store.select(selectIsAuthenticated);
  protected readonly user$ = this.#store.select(selectUserState);
  protected readonly authenticatedRoutes = [
    {
      title: 'My profile',
      path: '/profile',
    },
    {
      title: 'Settings',
      path: '/settings',
    },
  ];

  protected readonly unauthenticatedOptions = [
    {
      title: 'Google',
      icon: GoogleSvgComponent,
    },
    {
      title: 'Apple',
      icon: AppleSvgComponent,
    },
  ];

  protected signOut() {
    return;
  }
}
