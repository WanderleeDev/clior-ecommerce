import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BaseFormComponent,
  Field,
} from '../../../../shared/base-component/base-form.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { KeyValuePipe } from '@angular/common';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { ArrowLeftSvgComponent } from '../../../../shared/icons/arrow-left-svg.component';
import { ArrowRightSvgComponent } from '../../../../shared/icons/arrow-right-svg.component';
import { CamelCaseToSpacedPipe } from '../../../../shared/pipes/camel-case-to-spaced.pipe';
import { passwordMatchValidator } from '../../../../shared/utils/validators';
import { emailRgx, passwordRgx } from '../../../../shared/utils/regex';

interface AccountForm {
  email: string;
  password: string;
  confirmPassword: string;
  secretKey: string;
}

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule,
    errorTailorImports,
    KeyValuePipe,
    BtnBaseComponent,
    ArrowLeftSvgComponent,
    ArrowRightSvgComponent,
    CamelCaseToSpacedPipe,
  ],
  templateUrl: './account-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent extends BaseFormComponent<AccountForm> {
  protected override initForm() {
    return (this.form = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(emailRgx)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(18),
          Validators.pattern(passwordRgx),
        ],
      ],
      confirmPassword: ['', [Validators.required, passwordMatchValidator]],
      secretKey: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    }));
  }

  protected readonly fields: Field<AccountForm> = {
    email: { type: 'email' },
    password: { type: 'password' },
    confirmPassword: { type: 'password' },
    secretKey: { type: 'text' },
  };

  protected override submitForm(): void {
    if (!this.isValidForm) return;

    console.log(this.formValues);
  }
}
