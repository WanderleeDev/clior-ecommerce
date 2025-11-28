import { isDevMode } from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppProvider } from '.';
import { SHOPPING_CART_FEATURE } from '../../../modules/shopping-cart/store/shoppingCart.selectors';

export const ngrxProviders: AppProvider = [
  provideStore(),
  provideState(SHOPPING_CART_FEATURE),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
];
