import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RegisterFormLayoutComponent } from '../../../../../../layout/register-form-layout.component';
import { AccountFormComponent } from '../../../../components/account-form/account-form.component';

@Component({
  selector: 'app-account',
  imports: [RegisterFormLayoutComponent, AccountFormComponent],
  template: `
    <app-register-form-layout [currentStep]="2">
      <app-account-form />
    </app-register-form-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountComponent {}
