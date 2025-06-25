import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterStepLayoutComponent } from '../../layout/register-step-layout.component';
import { AccountFormComponent } from '../../components/account-form/account-form.component';

@Component({
  selector: 'app-register-step-2',
  imports: [RegisterStepLayoutComponent, AccountFormComponent],
  template: `
    <app-register-step-layout [currentStep]="2">
      <app-account-form />
    </app-register-step-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterStep2Component {}
