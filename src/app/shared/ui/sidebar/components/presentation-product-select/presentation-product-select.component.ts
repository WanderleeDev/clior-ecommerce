import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type VoidFn = () => void;
type WithReturnFn<T> = (params: T) => void;

@Component({
  selector: 'app-presentation-product-select',
  imports: [],
  templateUrl: './presentation-product-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PresentationProductSelectComponent),
      multi: true,
    },
  ],
})
export class PresentationProductSelectComponent
  implements ControlValueAccessor
{
  readonly label = input.required<string>();
  protected readonly typePresentations = [
    'dust',
    'capsules',
    'tablets',
    'liquid',
  ];
  readonly presentationSelected = signal<string[]>([]);

  isDisabled = false;
  onChange?: WithReturnFn<string[]>;
  onTouch?: VoidFn;

  protected onSelectPresentation(
    presentation: string,
    isChecked: boolean,
  ): void {
    let updatedPresentations: string[];

    if (isChecked) {
      updatedPresentations = [...this.presentationSelected(), presentation];
    } else {
      updatedPresentations = this.presentationSelected().filter(
        (p) => p !== presentation,
      );
    }

    this.presentationSelected.set(updatedPresentations);

    if (this.onChange) this.onChange(updatedPresentations);
    if (this.onTouch) this.onTouch();
  }

  public writeValue(presentations: string[]): void {
    this.presentationSelected.set(
      Array.isArray(presentations) ? presentations : [],
    );
  }

  public registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
