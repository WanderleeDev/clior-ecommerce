import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormLayoutComponent } from '../../../../../../layout/register-form-layout.component';
import { ConfirmFormComponent } from '../../../../components/confirm-form/confirm-form.component';
import { PreviousDataUserComponent } from '../../../../components/previous-data-user/previous-data-user.component';

@Component({
  selector: 'app-confirmation',
  imports: [
    RegisterFormLayoutComponent,
    ConfirmFormComponent,
    PreviousDataUserComponent,
  ],
  template: `
    <app-register-form-layout [currentStep]="3">
      <app-previous-data-user>
        <app-confirm-form />
      </app-previous-data-user>
    </app-register-form-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfirmationComponent {}
