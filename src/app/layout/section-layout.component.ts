import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'app-section-layout',
  imports: [LoaderComponent],
  template: `
    <section
      class="w-full lg:container md:mx-auto px-4 py-8 bg-blend-multiply"
      [class]="customClass()"
    >
      <ng-container select="header" />
      <ng-content>
        <app-loader textComplementary="loading section..." />
      </ng-content>
      <ng-container select="footer" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLayoutComponent {
  readonly customClass = input<string>('');
}
