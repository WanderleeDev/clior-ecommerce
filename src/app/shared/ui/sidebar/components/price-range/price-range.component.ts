import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

type VoidFn = () => void;
type WithReturnFn<T> = (value: T) => void;

@Component({
  selector: 'app-price-range',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './price-range.component.html',
  styles: `
    .range-input {
      @apply absolute pointer-events-none appearance-none bg-transparent h-1;
    }

    .range-input::-webkit-slider-thumb {
      @apply appearance-none pointer-events-auto w-4 h-4 rounded-full bg-transparent cursor-pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PriceRangeComponent,
      multi: true,
    },
  ],
})
export class PriceRangeComponent implements ControlValueAccessor {
  readonly minPriceRange = input.required<number>();
  readonly maxPriceRange = input.required<number>();
  protected readonly pricesRange = computed(() => [
    this.minPriceRange(),
    this.maxPriceRange(),
  ]);
  protected readonly minPrice = linkedSignal(() => this.pricesRange()[0]);
  protected readonly maxPrice = linkedSignal(() => this.pricesRange()[1]);

  protected readonly stepSize = computed(() =>
    Math.max(
      1,
      Math.floor((this.maxPriceRange() - this.minPriceRange()) * 0.05),
    ),
  );

  protected readonly leftPosition = computed(() => {
    return `${
      ((this.minPrice() - this.minPriceRange()) /
        (this.maxPriceRange() - this.minPriceRange())) *
      100
    }%`;
  });
  protected readonly rightPosition = computed(() => {
    return `${
      ((this.maxPrice() - this.minPriceRange()) /
        (this.maxPriceRange() - this.minPriceRange())) *
      100
    }%`;
  });
  protected readonly width = computed(() => {
    return `${
      ((this.maxPrice() - this.minPrice()) /
        (this.maxPriceRange() - this.minPriceRange())) *
      100
    }%`;
  });

  onChange?: WithReturnFn<number[]>;
  onTouch?: VoidFn;
  isDisabled = false;

  protected onChangeRange(event: Event, index: number): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (![0, 1].includes(index) || isNaN(value)) return;

    if (index === 0) {
      const maxAllowed = this.maxPrice() - this.stepSize();
      const newValue = Math.min(value, maxAllowed);
      this.minPrice.set(Math.max(newValue, this.minPriceRange()));
    } else {
      const minAllowed = this.minPrice() + this.stepSize();
      const newValue = Math.max(value, minAllowed);
      this.maxPrice.set(Math.min(newValue, this.maxPriceRange()));
    }

    if (this.onChange) this.onChange(this.pricesRange());
    if (this.onTouch) this.onTouch();
  }

  writeValue(values: number[]): void {
    if (Array.isArray(values) && values.length === 2) {
      const [min, max] = values;
      const validMin = Math.max(min, this.minPriceRange());
      const validMax = Math.min(max, this.maxPriceRange());

      if (validMin + this.stepSize() <= validMax) {
        this.minPrice.set(validMin);
        this.maxPrice.set(validMax);
      }
    }
  }

  registerOnChange(fn: (values: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
