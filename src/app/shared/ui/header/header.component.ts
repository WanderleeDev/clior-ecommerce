import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LinkBaseComponent } from '../../components/link-base/link-base.component';
import { CliorLogoLinkComponent } from '../../components/clior-logo-link/clior-logo-link.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { DropdownUserComponent } from '../../components/dropdown-user/dropdown-user.component';
import { BtnBaseComponent } from '../../components/btn-base/btn-base.component';
import { HamburgerBarComponent } from '../../icons/hamburger-bar.component';
import { ShoppingDropdownComponent } from '../../../modules/shopping-cart/components/shopping-dropdown/shopping-dropdown.component';

@Component({
  selector: 'app-header',
  imports: [
    LinkBaseComponent,
    CliorLogoLinkComponent,
    SearchBarComponent,
    DropdownUserComponent,
    BtnBaseComponent,
    HamburgerBarComponent,
    ShoppingDropdownComponent,
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly basicRoutes = ['home', 'products', 'contact'];
}
