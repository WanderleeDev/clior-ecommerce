import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { SHOP_CATEGORIES } from '../../../products/infrastructure/adapters/mock-product.adapter';

@Component({
  selector: 'app-shop-categories',
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-categories.html',
})
export class ShopCategories {
  protected readonly categories = SHOP_CATEGORIES;
}
