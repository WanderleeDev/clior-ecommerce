
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-cms',
    imports: [],
    templateUrl: './cms.component.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CmsComponent { }
