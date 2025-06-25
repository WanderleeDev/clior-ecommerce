import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BaseFormComponent,
  NgFormType,
} from '../../../../shared/base-component/base-form.component';
import { FormGroup, Validators } from '@angular/forms';

export interface Order {
  quantity: number;
  formulation: string;
  presentation: string;
  quantityPerPresentation: number;
}

@Component({
  selector: 'app-product-form-order',
  imports: [],
  templateUrl: './product-form-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormOrderComponent extends BaseFormComponent<Order> {
  selectedColor = 'pink';
  selectedStorage = '256GB';

  protected readonly readonlyformulation = [
    'daily essential',
    'clior economic',
    'clior premiun',
    'mixed limited',
  ];

  protected readonly quantity = [30, 60, 90];

  protected override initForm(): FormGroup<NgFormType<Order>> {
    return this.fb.group({
      quantity: [0, [Validators.required]],
      formulation: ['', [Validators.required]],
      presentation: ['', [Validators.required]],
      quantityPerPresentation: [30, [Validators.required]],
    });
  }
  protected override submitForm(): void {
    if (!this.isValidForm) return;

    console.log(this.formValues);
  }
}
