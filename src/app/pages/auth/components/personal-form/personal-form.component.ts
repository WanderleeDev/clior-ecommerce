import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BaseFormComponent,
  Field,
  NgFromType,
} from '../../../../shared/base-component/base-form.component';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { KeyValuePipe } from '@angular/common';
import { errorTailorImports } from '@ngneat/error-tailor';
import { CamelCaseToSpacedPipe } from '../../../../shared/pipes/camel-case-to-spaced.pipe';
import { PersonalData } from '../../interfaces/Form.interface';

@Component({
  selector: 'app-personal-form',
  imports: [
    BtnBaseComponent,
    KeyValuePipe,
    ReactiveFormsModule,
    errorTailorImports,
    CamelCaseToSpacedPipe,
  ],
  templateUrl: './personal-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalFormComponent extends BaseFormComponent<PersonalData> {
  protected readonly fields: Field<PersonalData> = {
    name: { type: 'text' },
    surname: { type: 'text' },
    phone: { type: 'text' },
    age: { type: 'number' },
  };

  protected readonly commonValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
  ];

  protected override initForm(): FormGroup<NgFromType<PersonalData>> {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      phone: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
    });
  }

  protected override submitForm(): void {
    if (!this.isValidForm) console.log(this.formValues);
  }
}
