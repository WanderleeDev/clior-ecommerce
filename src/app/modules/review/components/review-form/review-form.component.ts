import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import {
  BaseFormComponent,
  NgFormType,
} from '../../../../shared/base-component/base-form.component';
import { ReviewDTO } from '../../models/review.model';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnBaseComponent } from '../../../../shared/base-component/btn-base.component';
import { errorTailorImports } from '@ngneat/error-tailor';

@Component({
  selector: 'app-review-form',
  imports: [
    RatingComponent,
    ReactiveFormsModule,
    BtnBaseComponent,
    errorTailorImports,
  ],
  templateUrl: './review-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent extends BaseFormComponent<ReviewDTO> {
  protected override initForm(): FormGroup<NgFormType<ReviewDTO>> {
    return this.fb.group({
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(300),
        ],
      ],
      rating: [0, [Validators.min(0), Validators.max(5)]],
    });
  }

  protected override submitForm(): void {
    if (!this.isValidForm) return;

    console.log(this.formValues);
  }
}
