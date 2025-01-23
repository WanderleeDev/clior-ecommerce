import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BaseFormComponent,
  NgFormType,
} from '../../../../shared/base-component/base-form.component';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';

@Component({
  selector: 'app-confirm-form',
  imports: [ReactiveFormsModule, errorTailorImports, BtnBaseComponent],
  templateUrl: './confirm-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmFormComponent extends BaseFormComponent<{
  confirm: boolean;
}> {
  protected override initForm(): FormGroup<NgFormType<{ confirm: boolean }>> {
    return this.fb.group({
      confirm: [false, Validators.requiredTrue],
    });
  }

  protected override submitForm(): void {
    if (!this.isValidForm) return;
  }
}
