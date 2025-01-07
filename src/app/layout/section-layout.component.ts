import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
    selector: 'app-section-layout',
    imports: [LoaderComponent],
    template: `
    <section class="w-full lg:container md:mx-auto px-4 py-8 bg-blend-multiply">
      <ng-container select="header" />
      <ng-content>
        <app-loader textComplementary="loading section..." />
      </ng-content>
      <ng-container select="footer" />
    </section>
  `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionLayoutComponent {}
