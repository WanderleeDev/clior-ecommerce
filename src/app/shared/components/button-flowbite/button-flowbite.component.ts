import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button-flowbite',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button-flowbite.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonFlowbiteComponent {
  isDisabled = input<boolean>();
  label = input.required<string>();
  ariaLabel = input<string>();
  isFlexReverse = input<boolean>();
  typeButton = input<ButtonType>('button');
}
