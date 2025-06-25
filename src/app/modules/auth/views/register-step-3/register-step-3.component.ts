import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-register-step-3',
  imports: [],
  templateUrl: './register-step-3.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterStep3Component {}
