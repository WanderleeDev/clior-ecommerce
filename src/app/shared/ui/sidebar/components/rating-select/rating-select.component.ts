import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { RatingComponent } from '../../../../components/rating/rating.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type VoidFn = () => void;
type WithReturnFn<T> = (params: T) => void;

@Component({
  selector: 'app-rating-select',
  imports: [RatingComponent],
  templateUrl: './rating-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingSelectComponent),
      multi: true,
    },
  ],
})
export class RatingSelectComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  protected readonly ratings = [5, 4, 3, 2, 1];
  readonly ratingSelected = signal<number>(0);

  isDisabled?: boolean;
  onChange?: WithReturnFn<number>;
  onTouch?: VoidFn;

  protected onSelectRating(rating: number): void {
    if (!this.validateRating) return;

    this.ratingSelected.set(rating);

    if (this.onChange) this.onChange(rating);
    if (this.onTouch) this.onTouch();
  }

  public writeValue(rating: number): void {
    if (!this.validateRating) return;

    this.onSelectRating(rating);
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  private validateRating(rating: number): boolean {
    return this.ratings.includes(rating);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
