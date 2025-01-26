import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkBaseComponent } from '../link-base/link-base.component';

@Component({
  selector: 'app-clior-logo-link',
  imports: [LinkBaseComponent],
  template: `
    <app-link-base
      customClass="self-center text-xl font-semibold whitespace-nowrap text-white block border-t-2 border-b-2 uppercase tracking-widest md:text-2xl lg:text-3xl"
      href="/home"
    >
      Clior
    </app-link-base>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CliorLogoLinkComponent {}
