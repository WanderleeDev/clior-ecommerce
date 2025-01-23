import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type VoidFn = () => void;
export type WithReturnFn<T> = (params: T) => void;

@Component({
  selector: 'app-brand-select',
  templateUrl: './brand-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrandSelectComponent),
      multi: true,
    },
  ],
})
export class BrandSelectComponent implements ControlValueAccessor {
  readonly brands = input.required<string[]>();
  readonly brandSelected = signal<string>('');
  isDisabled?: boolean;
  onChange?: WithReturnFn<string>;
  onTouch?: VoidFn;

  protected onSelectBrand(brand: string): void {
    this.brandSelected.set(brand);

    if (this.onChange) this.onChange(brand);
    if (this.onTouch) this.onTouch();
  }

  public writeValue(value: string): void {
    if (!value.trim()) return;

    this.onSelectBrand(value);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
