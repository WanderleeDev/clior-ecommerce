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
import { BtnBaseComponent } from '../../../../shared/base-component/btn-base.component';
import { KeyValuePipe } from '@angular/common';
import { errorTailorImports } from '@ngneat/error-tailor';
import { CamelCaseToSpacedPipe } from '../../../../shared/pipes/camel-case-to-spaced.pipe';
import { RegisterStore } from '../../store/register/register.store';
import { RegisterStep1 } from '../../store/register/models/RegisterStep.model';

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
export class PersonalFormComponent
  extends BaseFormComponent<RegisterStep1>
  implements OnInit
{
  readonly #registerStore = inject(RegisterStore);

  protected readonly fields: Field<RegisterStep1> = {
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

  ngOnInit(): void {
    const prevValues = this.#registerStore.step1();

    if (prevValues) {
      this.form.setValue({
        name: prevValues.name,
        surname: prevValues.surname,
        age: prevValues.age,
        phone: prevValues.phone,
      });
    }
  }

  protected override initForm(): FormGroup<NgFormType<RegisterStep1>> {
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
    if (!this.isValidForm) return;

    this.#registerStore.setDataStep1(this.form.getRawValue());
  }
}
