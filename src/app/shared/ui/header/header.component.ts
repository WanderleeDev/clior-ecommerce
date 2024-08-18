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
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { UserControlComponent } from '../user-control/user-control.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterLink,
    SearchBarComponent,
    AvatarComponent,
    UserControlComponent,
  ],
  templateUrl: './header.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  #darkThemeService = inject(DarkThemeService);
  isLogged = false;
  hasDarkMode = this.#darkThemeService.getDarkModeComputed();
  isOpenDrawer = model<boolean>(false);

  public toggleDrawer(): void {
    this.isOpenDrawer.update((prev) => !prev);
  }

  public onClick(): void {
    this.#darkThemeService.darkModeToggle();
  }
}
