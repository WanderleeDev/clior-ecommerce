import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { FooterComponent } from '../shared/ui/footer/footer.component';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, LoaderComponent],
  template: `
    <main class="min-h-dvh w-full grid grid-rows-[auto_1fr_auto]">
      <app-header class="z-20" />
      <div class="py-4 md:py-8 xl:py-12 grid-layout h-full">
        <div class="grid-area-center content-center h-full">
          <ng-content>
            <app-loader
              class="grid-area-center"
              textComplementary="Loading page..."
            />
          </ng-content>
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
