import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFormComponent } from '../../../../shared/base-component/base-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { errorTailorImports } from '@ngneat/error-tailor';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';

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
      email: ['', this.generateValidators({ required: true, email: true })],
      subject: ['', this.generateValidators()],
      message: [
        '',
        this.generateValidators({
          required: true,
          maxLength: { validator: 250 },
        }),
      ],
    });
  }

  protected override submitForm(): void {
    if (!this.isValid) return;

    console.log(this.formValues);
  }
}
