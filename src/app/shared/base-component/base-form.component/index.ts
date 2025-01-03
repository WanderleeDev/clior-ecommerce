/**
 * Base component for handling form functionality in Angular applications.
 * Provides common form operations and validation handling.
 *
 * This class serves as a utility base component that can be extended by other form components.
 * It provides:
 * - Form initialization and validation infrastructure
 * - Common validator configurations (basic, pattern, numeric constraints)
 * - Form state management (reset, submit, validation)
 * - Abstract methods that child classes must implement for custom behavior
 *
 * Usage:
 * 1. Extend this class for specific form implementations
 * 2. Override initForm() to set up form controls
 * 3. Override submitForm() to handle form submission
 * 4. Use generateValidators() to create validation rules
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  BasicValidator,
  ComposeValidator,
  PatterValidator,
  ValidatorConfig,
} from './interfaces/BaseForm.interface';

@Component({
  selector: 'app-base-form',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormComponent {
  /** FormBuilder instance for creating form controls */
  protected readonly fb = inject(FormBuilder);

  /** Main form group instance */
  protected form: FormGroup = this.fb.nonNullable.group({});

  /** Basic validators map for required, email and requiredTrue validations */
  readonly #basicValidators: BasicValidator = {
    required: Validators.required,
    email: Validators.email,
    requiredTrue: Validators.requiredTrue,
  };

  /** Pattern validator map for regex pattern validation */
  readonly #patternValidator: PatterValidator = {
    pattern: (value: string | RegExp) => Validators.pattern(value),
  };

  /** Compose validators map for numeric constraints validation */
  readonly #composeValidators: ComposeValidator = {
    max: (value: number) => Validators.max(value),
    min: (value: number) => Validators.min(value),
    maxLength: (value: number) => Validators.maxLength(value),
    minLength: (value: number) => Validators.minLength(value),
  };

  constructor() {
    this.initFrom();
  }

  /** Returns whether the form is valid */
  get isValid() {
    return this.form.valid;
  }

  /** Returns the raw form values */
  get formValues() {
    return this.form.getRawValue();
  }

  /**
   * Generates an array of validators based on configuration
   * @param config - Validator configuration object
   * @returns Array of validator functions
   */
  protected generateValidators(
    config: ValidatorConfig = { required: true },
  ): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    for (const [key, value] of Object.entries(config)) {
      if (!value) continue;

      if (typeof value === 'boolean') {
        validators.push(this.#basicValidators[key as keyof BasicValidator]);
        continue;
      }

      if (typeof value !== 'object') continue;

      if (typeof value.validator === 'number') {
        validators.push(
          this.#composeValidators[key as keyof ComposeValidator](
            value.validator,
          ),
        );
        continue;
      }

      validators.push(this.#patternValidator.pattern(value.validator));
    }

    return validators;
  }

  /** Resets the form to empty state */
  protected resetForm(): void {
    this.form.reset();
  }

  /**
   * Abstract method to be implemented by child classes for form submission
   * @throws Error if not overridden
   */
  protected submitForm(): void {
    throw new Error('[BaseFormComponent] submitForm Method not overridden');
  }

  /**
   * Abstract method to be implemented by child classes for form initialization
   * @throws Error if not overridden
   */
  protected initFrom(): void {
    throw new Error('[BaseFormComponent] initFrom must be implemented');
  }
}
