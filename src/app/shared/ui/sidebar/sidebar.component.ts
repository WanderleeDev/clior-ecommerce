import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BtnBaseComponent } from '../../components/btn-base/btn-base.component';
import { BrandSelectComponent } from './components/brand-select/brand-select.component';
import { PriceRangeComponent } from './components/price-range/price-range.component';
import {
  BaseFormComponent,
  NgFormType,
} from '../../base-component/base-form.component';
import { SearchSvgComponent } from '../../icons/search-svg.component';
import { RatingSelectComponent } from './components/rating-select/rating-select.component';
import { PresentationProductSelectComponent } from './components/presentation-product-select/presentation-product-select.component';

interface SidebarProducts {
  brand: string;
  priceRange: number[];
  rating: number;
  presentation: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [
    ReactiveFormsModule,
    BtnBaseComponent,
    BrandSelectComponent,
    PriceRangeComponent,
    SearchSvgComponent,
    RatingSelectComponent,
    PresentationProductSelectComponent,
  ],
  templateUrl: './sidebar.component.html',
  host: {
    'aria-hidden': 'false',
  },
})
export class SidebarComponent extends BaseFormComponent<SidebarProducts> {
  protected readonly MIN_PRICE = 0;
  protected readonly MAX_PRICE = 3500;
  protected readonly brands = [
    'Optimum Nutrition',
    'Dymatize',
    'BSN',
    'MuscleTech',
    'MyProtein',
    'NOW Sports',
    'Cellucor',
    'Quest Nutrition',
    'Universal Nutrition',
    'MusclePharm',
  ];

  protected override initForm(): FormGroup<NgFormType<SidebarProducts>> {
    return this.fb.group({
      brand: [''],
      priceRange: [[] as number[]],
      rating: [0],
      presentation: [[] as string[]],
    });
  }

  protected override submitForm(): void {
    // if (!this.isValidForm) return;
    console.log(this.formValues);
  }
}
