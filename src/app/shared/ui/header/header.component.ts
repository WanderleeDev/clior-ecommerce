import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { DarkThemeService } from '../../services/darkTheme.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/models/App.model';
import { selectIsAuthenticated } from '../../../core/store/auth/auth.selectors';
import { ShoppingCarSvgComponent } from '../../icons/shopping-car-svg.component';
import { SearchSvgComponent } from '../../icons/search-svg.component';
import { HamburgerBarComponent } from '../../icons/hamburger-bar.component';
import { DropdownUserComponent } from '../dropdown-user/dropdown-user.component';
import { BtnBaseComponent } from '../../components/btn-base/btn-base.component';
import { AUTH_ACTIONS } from '../../../core/store/auth/auth.actions';

@Component({
    selector: 'app-header',
    imports: [
        NavbarComponent,
        RouterLink,
        SearchBarComponent,
        RouterLink,
        ShoppingCarSvgComponent,
        SearchSvgComponent,
        HamburgerBarComponent,
        DropdownUserComponent,
        BtnBaseComponent,
    ],
    templateUrl: './header.component.html',
    host: {
        class: 'z-50 sticky top-0',
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly #darkThemeService = inject(DarkThemeService);
  readonly #store: Store<AppState> = inject(Store);
  readonly isLogged = this.#store.selectSignal(selectIsAuthenticated);
  readonly username = 'fake username';
  hasDarkMode = this.#darkThemeService.getDarkModeComputed();
  isOpenDrawer = model<boolean>(false);

  public toggleDrawer(): void {
    this.isOpenDrawer.update((prev) => !prev);
  }

  public onClick(): void {
    this.#darkThemeService.darkModeToggle();
  }

  public onSignOut(): void {
    if (!this.isLogged()) return;

    this.#store.dispatch(AUTH_ACTIONS.logout());
  }
}
