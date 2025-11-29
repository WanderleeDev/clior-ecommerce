import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { EmptyUserSvgComponent } from '../../icons/empty-user-svg.component';
import { ArrowDownSvgComponent } from '../../icons/arrow-down-svg.component';
import { LetDirective } from '@ngrx/component';
import { BtnBaseComponent } from '../../base-component/btn-base.component';
import { DividerComponent } from '../divider/divider.component';
import { RouterLink } from '@angular/router';
import { GoogleSvgComponent } from '../../icons/google-svg.component';
import { AppleSvgComponent } from '../../icons/apple-svg.component';
import { NgComponentOutlet } from '@angular/common';
import { LinkBaseComponent } from '../link-base/link-base.component';

export const NULL_USER = {
  id: '0000-0000-0000',
  firstName: 'Guest',
  lastName: 'User',
  age: 0,
  image: null,
  email: 'email@notprovided.error',
  phone: '000-000-0000',
  role: 'guest',
  address: 'No address provided',
  city: 'No city provided',
  state: 'No state provided',
  zip: 'No zip provided',
};

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
  // TODO: Add a service to handle authentication and user state
  protected readonly isLogged$ = true;
  //  TODO: Replace with actual user state from store
  protected readonly user$ = NULL_USER;
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
