import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLayoutComponent } from '../../layout/main-layout.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainLayoutComponent, RouterOutlet],
  template: `
    <app-main-layout>
      <router-outlet class="hidden" />
    </app-main-layout>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {

}
