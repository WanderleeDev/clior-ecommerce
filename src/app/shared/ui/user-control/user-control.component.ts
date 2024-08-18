import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DropdownMenuComponent } from '../../components/dropdown-menu/dropdown-menu.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { LoginOptionsComponent } from '../../components/login-options/login-options.component';

@Component({
  selector: 'app-user-control',
  standalone: true,
  imports: [DropdownMenuComponent, AvatarComponent, LoginOptionsComponent],
  templateUrl: './user-control.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserControlComponent {
  isViewDripMenu = signal(false);
  isLogged = signal(false);

  public onClick(): void {
    this.isViewDripMenu.update((prev) => !prev);
  }
}
