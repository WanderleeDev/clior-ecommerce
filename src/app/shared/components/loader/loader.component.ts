import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styles: `
    :host {
      transition: linear 0.2s opacity, transform 0.2s opacity;

      @starting-style {
        opacity: 0;
        transform: translateY(2rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  textComplementary = input<string>();
  onlyLoader = input(false, {
    transform: booleanAttribute,
  });
}
