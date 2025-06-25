import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-register-final-step',
  imports: [],
  templateUrl: './register-final-step.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFinalStepComponent { }
