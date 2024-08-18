import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorTailorImports } from '@ngneat/error-tailor';
import { InputFlowbiteComponent } from '../../../../../../shared/components/input-flowbite/input-flowbite.component';
import { ButtonFlowbiteComponent } from '../../../../../../shared/components/button-flowbite/button-flowbite.component';
import { RegisterFormLayoutComponent } from '../../../../../../layout/register-form-layout.component';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [
    errorTailorImports,
    ReactiveFormsModule,
    InputFlowbiteComponent,
    ButtonFlowbiteComponent,
    RegisterFormLayoutComponent,
  ],
  templateUrl: './personal-info-form.component.html',
  styles: `
    :host {
      display: block;
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonalInfoFormComponent {
  #formBuilder = inject(FormBuilder);
  formRegister = this.#formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    surname: ['', [Validators.required, Validators.minLength(5)]],
    age: ['', [Validators.required, Validators.min(18)]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
  });

  constructor(private readonly router: Router) {}

  public onSubmit() {
    this.router.navigate(['/register/step-2']);
  }
}
