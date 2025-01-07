import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  BaseFormComponent,
  NgFromType,
} from '../../../../shared/base-component/base-form.component';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ContactForm } from '../../interfaces/Contact.interface';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, errorTailorImports, BtnBaseComponent],
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent extends BaseFormComponent<ContactForm> {
  protected readonly MAX_LENGTH = 250;
  protected readonly affairs = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'product', label: 'Product Information' },
    { value: 'order', label: 'Order Status' },
    { value: 'support', label: 'Technical Support' },
  ];
  protected readonly isSubmitted = signal(false);
  protected readonly messageLength = toSignal(
    this.form.controls['message'].valueChanges.pipe(
      map((value) => value.length),
    ),
    { initialValue: 0 },
  );

  protected override initForm(): FormGroup<NgFromType<ContactForm>> {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: [
        '',
        [Validators.required, Validators.maxLength(this.MAX_LENGTH)],
      ],
    });
  }

  protected override submitForm(): void {
    if (!this.isValidForm) return;
    console.log(this.formValues);

    this.isSubmitted.set(true);
  }
}
