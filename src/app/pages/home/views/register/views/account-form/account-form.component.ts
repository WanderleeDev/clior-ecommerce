import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorTailorImports } from '@ngneat/error-tailor';
import { InputFlowbiteComponent } from '../../../../../../shared/components/input-flowbite/input-flowbite.component';
import { ButtonFlowbiteComponent } from '../../../../../../shared/components/button-flowbite/button-flowbite.component';
import { ArrowLeftSvgComponent } from '../../../../../../shared/icons/arrow-left-svg.component';
import { ArrowRightSvgComponent } from '../../../../../../shared/icons/arrow-right-svg.component';
import { RegisterFormLayoutComponent } from '../../../../../../layout/register-form-layout.component';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    errorTailorImports,
    ReactiveFormsModule,
    InputFlowbiteComponent,
    ButtonFlowbiteComponent,
    ArrowLeftSvgComponent,
    ArrowRightSvgComponent,
    RegisterFormLayoutComponent,
  ],
  templateUrl: './account-form.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountFormComponent {
  #formBuilder = inject(FormBuilder);
  accountForm = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.maxLength(12), Validators.minLength(7)],
    ],
    confirmPassword: ['', [Validators.required]],
    secretKey: ['', [Validators.required, Validators.minLength(7)]],
  });

  readonly fieldsForm = [
    {
      name: 'Email',
      control: 'email',
      type: 'email',
    },
    {
      name: 'Password',
      control: 'password',
      type: 'password',
    },
    {
      name: 'ConfirmPassword',
      control: 'confirmPassword',
      type: 'password',
    },
    {
      name: 'SecretKey',
      control: 'secretKey',
      type: 'number',
    },
  ];

  constructor(private readonly router: Router) {}

  public onSubmit(): void {
    if (this.accountForm.invalid) return;

    this.router.navigate(['/register/step-3']);
  }

  public onBackStep(): void {
    this.router.navigate(['/register/step-1']);
  }
}
