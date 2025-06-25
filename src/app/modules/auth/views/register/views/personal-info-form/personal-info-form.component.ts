import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormLayoutComponent } from '../../../../layout/register-step-layout.component';
import { PersonalFormComponent } from '../../../../components/personal-form/personal-form.component';

@Component({
  selector: 'app-personal-info-form',
  imports: [RegisterFormLayoutComponent, PersonalFormComponent],
  template: `
    <app-register-form-layout [currentStep]="1">
      <app-personal-form />
    </app-register-form-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonalInfoFormComponent {}
