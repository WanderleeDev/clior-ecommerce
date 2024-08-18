import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-options',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './login-options.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginOptionsComponent {
  options = [
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
