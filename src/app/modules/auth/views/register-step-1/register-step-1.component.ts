import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterStepLayoutComponent } from '../../layout/register-step-layout.component';
import { PersonalFormComponent } from '../../components/personal-form/personal-form.component';

@Component({
  selector: 'app-register-step-1',
  imports: [RegisterStepLayoutComponent, PersonalFormComponent],
  template: `
    <app-register-step-layout [currentStep]="1">
      <app-personal-form />
    </app-register-step-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterStep1Component {}
