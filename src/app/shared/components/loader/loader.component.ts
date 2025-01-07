import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-loader',
    imports: [
        CommonModule,
    ],
    templateUrl: './loader.component.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  textComplementary = input<string>();
}
