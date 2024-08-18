import { ChangeDetectionStrategy, Component, OnDestroy, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { errorTailorImports } from '@ngneat/error-tailor';
import { Subscription } from 'rxjs';

interface InputField {
  name: string;
  control: string;
  type: string;
  placeholder?: string;
}

@Component({
  selector: 'app-input-flowbite',
  standalone: true,
  imports: [errorTailorImports, ReactiveFormsModule],
  templateUrl: './input-flowbite.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFlowbiteComponent,
      multi: true,
    }
  ]
})
export class InputFlowbiteComponent<T> implements ControlValueAccessor, OnDestroy {
  #controlSubscription?: Subscription;
  fieldData = input.required<InputField>();
  fieldValidators = input<ValidatorFn[]>([]);
  inputControl = new FormControl<T | null>(null, {
    nonNullable: true,
    validators: [...this.fieldValidators()],
  });

  change!: (value: T) => void;
  touched!: () => T;
  isDisabled?: boolean;

  public writeValue(value: T): void {
    if (!value) return;

    this.inputControl.setValue(value, { emitEvent: false });
  }

  public registerOnChange(fn: () => T): void {
    this.#controlSubscription = this.inputControl.valueChanges.subscribe(fn);
    this.change = fn;
  }

  public registerOnTouched(fn: () => T): void {
    this.touched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) return this.inputControl.disable();

    this.inputControl.enable()
  }

  // public validate(): ValidationErrors | null {
  //   if (this.inputControl.valid) return null;

  //   return { invalid: true };
  // }

  ngOnDestroy(): void {
    this.#controlSubscription?.unsubscribe()
  }
}
