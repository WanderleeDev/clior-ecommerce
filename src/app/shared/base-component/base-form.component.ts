import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  MaxValidator,
  MinLengthValidator,
  MinValidator,
  PatternValidator,
  ReactiveFormsModule,
  RequiredValidator,
  ValidatorFn,
  Validators,
} from '@angular/forms';

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

export type DynamicValue<T, K> = T extends true ? { validator: K } : false;

type ValidatorTypes =
  | RequiredValidator
  | EmailValidator
  | MinValidator
  | MaxValidator
  | MinLengthValidator
  | MaxLengthValidator
  | PatternValidator;

export interface ComposeValidators {
  [FormValidator.MAX]: DynamicValue<boolean, number>;
  [FormValidator.MIN]: DynamicValue<boolean, number>;
  [FormValidator.MAX_LENGTH]: DynamicValue<boolean, number>;
  [FormValidator.MIN_LENGTH]: DynamicValue<boolean, number>;
  [FormValidator.PATTERN]: DynamicValue<boolean, string | RegExp>;
}

export interface CommonValidator {
  [FormValidator.REQUIRED]: boolean;
  [FormValidator.REQUIRED_TRUE]: boolean;
  [FormValidator.EMAIL]: boolean;
}

export type ValidatorConfig = Partial<CommonValidator & ComposeValidators>;

@Component({
  selector: 'app-base-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<p>base-form works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormComponent {
  readonly #fb = inject(FormBuilder);
  protected readonly form: FormGroup = this.#fb.nonNullable.group({});

  private readonly validatorMap = {
    required: () => Validators.required,
    requiredTrue: () => Validators.requiredTrue,
    email: () => Validators.email,
    max: (value: number) => Validators.max(value),
    min: (value: number) => Validators.min(value),
    maxLength: (value: number) => Validators.maxLength(value),
    minLength: (value: number) => Validators.minLength(value),
    pattern: (value: string | RegExp) => Validators.pattern(value),
  } as const;

  get isValid() {
    return this.form.valid;
  }

  get values() {
    return this.form.getRawValue();
  }

  protected generateValidatorss(
    config: ValidatorConfig = { required: true },
  ): ValidatorFn[] {
    return Object.entries(config)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        const validatorValue =
          typeof value === 'object' ? value.validator : undefined;
        return this.validatorMap[key as keyof typeof this.validatorMap](
          validatorValue,
        );
      });
  }

  protected generateValidators(
    config: ValidatorConfig = { required: true, max: { validator: 0 } },
  ) {
    const validators = [];

    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'object') {
        validators.push(Validators[key as FormValidator](value.validator));
      }

      if (typeof value === 'boolean') {
        validators.push(Validators[key as FormValidator]);
      }
    }

    if (config[FormValidator.REQUIRED]) {
      validators.push(Validators.required);
    }

    if (config[FormValidator.REQUIRED_TRUE]) {
      validators.push(Validators.requiredTrue);
    }

    if (config[FormValidator.EMAIL]) {
      validators.push(Validators.email);
    }

    if (config[FormValidator.MAX]) {
      validators.push(Validators.max(config[FormValidator.MAX].validator));
    }

    if (config[FormValidator.MIN]) {
      validators.push(Validators.min(config[FormValidator.MIN].validator));
    }

    if (config[FormValidator.MAX_LENGTH]) {
      validators.push(
        Validators.maxLength(config[FormValidator.MAX_LENGTH].validator),
      );
    }

    if (config[FormValidator.MIN_LENGTH]) {
      validators.push(
        Validators.minLength(config[FormValidator.MIN_LENGTH].validator),
      );
    }

    if (config[FormValidator.PATTERN]) {
      validators.push(
        Validators.pattern(config[FormValidator.PATTERN].validator),
      );
    }

    return validators;
  }
}
