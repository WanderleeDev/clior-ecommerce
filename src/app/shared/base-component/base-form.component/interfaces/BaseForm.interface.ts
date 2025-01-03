/**
 * Base form validation configuration types
 * Used for extending and creating form components with validation
 */

import type { ValidatorFn } from '@angular/forms';

/**
 * Interface for basic validators that don't require additional parameters
 * @property required - Field is required
 * @property requiredTrue - Field must be true (e.g. for checkboxes)
 * @property email - Field must be valid email format
 */
export interface CommonValidator {
  required: boolean;
  requiredTrue: boolean;
  email: boolean;
}

/**
 * Interface for validators that require additional configuration parameters
 * @property max - Maximum numeric value
 * @property min - Minimum numeric value
 * @property maxLength - Maximum string length
 * @property minLength - Minimum string length
 * @property pattern - Regular expression pattern to match
 */
export interface ComposeValidators {
  max: DynamicValue<boolean, number>;
  min: DynamicValue<boolean, number>;
  maxLength: DynamicValue<boolean, number>;
  minLength: DynamicValue<boolean, number>;
  pattern: DynamicValue<boolean, string | RegExp>;
}

/**
 * Helper type for validators that require a parameter value
 * If T is true, requires a validator parameter of type K
 * If T is false, validator is disabled
 */
export type DynamicValue<T, K> = T extends true ? { validator: K } : false;

/**
 * Combined validator configuration type
 * Makes all validator properties optional
 */
export type ValidatorConfig = Partial<CommonValidator & ComposeValidators>;

/**
 * Interface for basic validator functions without parameters
 * @property required - Validator function for required fields
 * @property requiredTrue - Validator function requiring true value
 * @property email - Validator function for email format
 */

export interface BasicValidator {
  required: ValidatorFn;
  requiredTrue: ValidatorFn;
  email: ValidatorFn;
}

/**
 * Interface for validator functions requiring numeric parameters
 * @property max - Validator function for maximum value
 * @property min - Validator function for minimum value
 * @property maxLength - Validator function for maximum length
 * @property minLength - Validator function for minimum length
 */
export interface ComposeValidator {
  max: (value: number) => ValidatorFn;
  min: (value: number) => ValidatorFn;
  maxLength: (value: number) => ValidatorFn;
  minLength: (value: number) => ValidatorFn;
}

/**
 * Interface for pattern validator function
 * @property pattern - Validator function for regex pattern matching
 */
export interface PatterValidator {
  pattern: (value: string | RegExp) => ValidatorFn;
}
