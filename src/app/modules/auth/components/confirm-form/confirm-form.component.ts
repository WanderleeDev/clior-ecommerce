import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BaseFormComponent,
  NgFormType,
} from '../../../../shared/base-component/base-form.component';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { RegisterStore } from '../../store/register/register.store';
import { RegisterStep3 } from '../../store/register/models/RegisterStep.model';

@Component({
  selector: 'app-confirm-form',
  imports: [ReactiveFormsModule, errorTailorImports, BtnBaseComponent],
  templateUrl: './confirm-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmFormComponent extends BaseFormComponent<RegisterStep3> {
  readonly #registerStore = inject(RegisterStore);
  protected override initForm(): FormGroup<NgFormType<RegisterStep3>> {
    return this.fb.group({
      acceptTermAndConditions: [false, Validators.requiredTrue],
    });
  }

  protected override async submitForm(): Promise<void> {
    if (!this.isValidForm) return;

    this.#registerStore.setDataStep3(this.form.getRawValue());
    await this.#registerStore.sendRegister();
  }
}
