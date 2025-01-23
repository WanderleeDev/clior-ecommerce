import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-section',
  imports: [],
  template: `
    <section>
      <header>
        <ng-content select="header" />
      </header>
      <div class="container mx-auto px-4">
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {}
