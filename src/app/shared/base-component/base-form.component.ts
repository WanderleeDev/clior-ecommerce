import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormGroup, FormControl, NonNullableFormBuilder } from '@angular/forms';

/**
 * Type definition for creating strongly-typed Angular form structures
 * @template T - The interface/type representing the form data structure
 * @returns A type with FormControl for primitive values and nested FormGroups for objects
 */
export type NgFromType<T> = {
  [K in keyof T]: T[K] extends object
    ? FormGroup<NgFromType<T[K]>>
    : FormControl<T[K]>;
};

/**
 * Abstract base component for handling Angular reactive forms
 * Provides common form functionality and type safety
 *
 * @template T - The interface/type representing the form data structure
 *
 * @example
 * interface UserForm {
 *   name: string;
 *   email: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   }
 * }
 *
 * class UserFormComponent extends BaseFormComponent<UserForm> {
 *   protected initForm(): FormGroup<NgFromType<UserForm>> {
 *     return this.fb.group({
 *       name: [''],
 *       email: [''],
 *       address: this.fb.group({
 *         street: [''],
 *         city: ['']
 *       })
 *     });
 *   }
 *
 *   protected submitForm(): void {
 *     if(this.isValidForm) {
 *       console.log(this.formValues);
 *     }
 *   }
 * }
 */

/**
 * Type definition for form field configuration
 * Defines the structure for form field metadata including input type and placeholder
 *
 * @template T - The interface/type representing the form data structure
 *
 * @example
 * interface UserForm {
 *   name: string;
 *   email: string;
 * }
 *
 * const fields: Field<UserForm> = {
 *   name: { type: 'text', placeholder: 'Enter your name' },
 *   email: { type: 'email', placeholder: 'Enter your email' }
 * };
 */
export type Field<T> = {
  [key in keyof T]: { type: string; placeholder?: string };
};
@Component({
  selector: 'app-base-form',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseFormComponent<T> {
  /** Form builder instance for creating form controls and groups */
  protected readonly fb = inject(NonNullableFormBuilder);

  /** The strongly-typed form instance */
  protected form: FormGroup<NgFromType<T>>;

  /**
   * Constructor initializes the form by calling initForm()
   * Throws an error if form initialization fails
   * @throws Error if form is not properly initialized
   */
  constructor() {
    this.form = this.initForm();

    if (!this.form) {
      throw new Error('Form not initialized');
    }
  }

  /** Returns whether the form is valid */
  get isValidForm() {
    return this.form.valid;
  }

  /** Returns the current form values */
  get formValues() {
    return this.form.getRawValue();
  }

  /**
   * Initialize the form structure
   * Must be implemented by child classes
   * @returns A strongly-typed FormGroup instance
   */
  protected abstract initForm(): FormGroup<NgFromType<T>>;

  /**
   * Handle form submission
   * Must be implemented by child classes
   */
  protected abstract submitForm(): void;

  /**
   * Resets the form to its initial state
   */
  protected resetForm(): void {
    this.form.reset();
  }
}
