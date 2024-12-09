import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stepper-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper-register.component.html',
  styles: `
    :host {
      display: block;
    }

    .word-spacing {
      word-spacing: 0.2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperRegisterComponent {
  currentStep = input.required<number>();
  listStyle =
    "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-500";
  steps = ['Personal', 'Account', 'Confirmation'];
}
