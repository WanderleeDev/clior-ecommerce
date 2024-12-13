import { isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppProvider } from '.';
import { ROOT_EFFECTS, ROOT_REDUCERS } from '../../store/app.state';

export const ngrxProviders: AppProvider = [
  provideStore(ROOT_REDUCERS),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  provideEffects(ROOT_EFFECTS),
];
