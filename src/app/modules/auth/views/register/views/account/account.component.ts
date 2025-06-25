import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AccountFormComponent } from '../../../../components/account-form/account-form.component';
import { RegisterStepLayoutComponent } from '../../../../layout/register-step-layout.component';

@Component({
  selector: 'app-account',
  imports: [RegisterStepLayoutComponent, AccountFormComponent],
  template: `
    <app-register-form-layout [currentStep]="2">
      <app-account-form />
    </app-register-form-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountComponent {}
