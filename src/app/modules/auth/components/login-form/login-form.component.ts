import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BaseFormComponent,
  Field,
  NgFormType,
} from '../../../../shared/base-component/base-form.component';
import { ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { KeyValuePipe } from '@angular/common';
import { BtnBaseComponent } from '../../../../shared/base-component/btn-base.component';
import { emailRgx, passwordRgx } from '../../../../shared/utils/regex';

interface LoginForm {
  email: string;
  password: string;
  autoSave: boolean;
}

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    errorTailorImports,
    BtnBaseComponent,
    KeyValuePipe,
  ],
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent extends BaseFormComponent<LoginForm> {
  protected override initForm(): FormGroup<NgFormType<LoginForm>> {
    return this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(emailRgx)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(passwordRgx),
        ],
      ],
      autoSave: [false],
    });
  }

  protected readonly fields: Field<LoginForm> = {
    email: { type: 'email' },
    password: { type: 'password' },
    autoSave: { type: 'checkbox', placeholder: 'Remember me' },
  };

  protected override submitForm(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      this.resetForm();
    }
  }
}
