import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StepperRegisterComponent } from './component/stepper-register/stepper-register.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [StepperRegisterComponent, RouterOutlet],
  template: ` <router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {}
