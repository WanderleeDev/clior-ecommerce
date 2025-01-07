import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';

@Component({
    selector: 'app-form-payment-methods',
    imports: [ReactiveFormsModule, BtnBaseComponent],
    templateUrl: './form-payment-methods.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPaymentMethodsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DialogRef);

  readonly cardTypes = ['visa', 'mastercard'] as const;

  readonly form = this.fb.group({
    cardNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/),
      ],
    ],
    cardHolder: ['', [Validators.required, Validators.minLength(3)]],
    expiryDate: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
      ],
    ],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    type: ['visa', Validators.required],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
