import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormLayoutComponent } from '../../../../../../layout/register-form-layout.component';
import { ConfirmFormComponent } from '../../../../components/confirm-form/confirm-form.component';

@Component({
  selector: 'app-confirmation',
  imports: [RegisterFormLayoutComponent, ConfirmFormComponent],
  template: `
    <app-register-form-layout [currentStep]="3">
      <app-confirm-form />
    </app-register-form-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfirmationComponent {}
