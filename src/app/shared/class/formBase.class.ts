import { inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum FormValidator {
  REQUIRED = 'required',
  REQUIRED_TRUE = 'requiredTrue',
  EMAIL = 'email',
  MAX = 'max',
  MIN = 'min',
  MAX_LENGTH = 'maxLength',
  MIN_LENGTH = 'minLength',
  PATTERN = 'pattern',
}

type ConfigForm = Record<FormValidator, boolean>;

export class FormBase {
  readonly #fb = inject(FormBuilder);
  protected readonly form: FormGroup = this.#fb.nonNullable.group({});

  get isValid() {
    return this.form.valid;
  }

  get values() {
    return this.form.getRawValue();
  }

  protected generateValidators({ required = true }: ConfigForm) {
    return Object.entries(config).map(([key, value]) => {
      if (value) {
        return Validators[key as FormValidator];
      }
    });
  }
}
