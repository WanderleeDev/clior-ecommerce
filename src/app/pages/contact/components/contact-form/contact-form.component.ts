import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BaseFormComponent } from '../../../../shared/base-component/base-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { errorTailorImports } from '@ngneat/error-tailor';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    errorTailorImports,
    BtnBaseComponent,
  ],
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent extends BaseFormComponent {
  protected readonly MAX_LENGTH = 250;
  protected readonly affairs = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'product', label: 'Product Information' },
    { value: 'order', label: 'Order Status' },
    { value: 'support', label: 'Technical Support' },
  ];

  protected override initFrom(): void {
    this.form = this.fb.nonNullable.group({
      name: [
        '',
        this.generateValidators({
          required: true,
          minLength: { validator: 3 },
          maxLength: { validator: 50 },
        }),
      ],
      subject: ['', this.generateValidators()],
      email: ['', this.generateValidators({ required: true, email: true })],
      message: [
        '',
        this.generateValidators({
          required: true,
          maxLength: { validator: this.MAX_LENGTH },
        }),
      ],
    });
  }

  protected readonly messageLength = toSignal(
    this.form.controls['message'].valueChanges.pipe(
      map((value) => value.length),
    ),
    { initialValue: 0 },
  );

  isSubmitted = signal(false);

  protected override submitForm(): void {
    if (!this.isValid) return;
    console.log(this.formValues);

    this.isSubmitted.set(true);
  }
}
