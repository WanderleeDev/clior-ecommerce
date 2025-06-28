import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterStepLayoutComponent } from '../../layout/register-step-layout.component';
import { PreviousDataUserComponent } from '../../components/previous-data-user/previous-data-user.component';
import { ConfirmFormComponent } from '../../components/confirm-form/confirm-form.component';

@Component({
  selector: 'app-register-step-3',
  imports: [
    RegisterStepLayoutComponent,
    PreviousDataUserComponent,
    ConfirmFormComponent,
  ],
  template: `
    <app-register-step-layout [currentStep]="3">
      <app-previous-data-user>
        <app-confirm-form />
      </app-previous-data-user>
    </app-register-step-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterStep3Component {}
