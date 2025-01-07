import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-user-menu-unauthenticated',
    imports: [NgOptimizedImage, RouterLink],
    templateUrl: './user-menu-unauthenticated.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuUnauthenticatedComponent {
  protected readonly options = [
    {
      title: 'Google',
      icon: 'assets/icons/google.svg',
    },
    {
      title: 'Apple',
      icon: 'assets/icons/apple.svg',
    },
  ];
}
