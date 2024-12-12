import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { FooterComponent } from '../shared/ui/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  template: `
    <main
      class="min-h-dvh w-full grid grid-rows-[auto_1fr_auto] max-w-[120rem] mx-auto"
    >
      <app-header />
      <div class="grid-layout h-full overflow-x-hidden">
        <div class="grid-area-center content-center h-full">
          <router-outlet />
        </div>
      </div>
      <app-footer />
    </main>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
