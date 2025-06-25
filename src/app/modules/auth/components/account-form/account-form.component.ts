import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  BaseFormComponent,
  Field,
  NgFormType,
} from '../../../../shared/base-component/base-form.component';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { KeyValuePipe } from '@angular/common';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { ArrowLeftSvgComponent } from '../../../../shared/icons/arrow-left-svg.component';
import { ArrowRightSvgComponent } from '../../../../shared/icons/arrow-right-svg.component';
import { CamelCaseToSpacedPipe } from '../../../../shared/pipes/camel-case-to-spaced.pipe';
import { passwordMatchValidator } from '../../../../shared/utils/validators';
import { emailRgx, passwordRgx } from '../../../../shared/utils/regex';
import { RegisterStore } from '../../store/register/register.store';
import { RegisterStep2 } from '../../store/register/models/RegisterStep.model';

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
export class AccountFormComponent
  extends BaseFormComponent<RegisterStep2>
  implements OnInit
{
  readonly #registerStore = inject(RegisterStore);

  ngOnInit(): void {
    const prevValues = this.#registerStore.step2();

    if (prevValues) {
      this.form.setValue({
        email: prevValues.email,
        password: prevValues.password,
        confirmPassword: prevValues.confirmPassword,
        secretKey: prevValues.secretKey,
      });
    }
  }

  protected override initForm(): FormGroup<NgFormType<RegisterStep2>> {
    return this.fb.group({
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
    });
  }

  protected readonly fields: Field<RegisterStep2> = {
    email: { type: 'email' },
    password: { type: 'password' },
    confirmPassword: { type: 'password' },
    secretKey: { type: 'text' },
  };

  protected override submitForm(): void {
    if (!this.isValidForm) return;

    this.#registerStore.setDataStep2(this.form.getRawValue());
  }

  public navigateToStepOne() {
    this.#registerStore.navigateByStep(1);
  }
}
