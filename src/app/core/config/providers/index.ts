import { Provider, EnvironmentProviders } from '@angular/core';
import { angularProviders } from './angular.providers';
import { errorTailorProviders } from './errorTailor.providers';
import { ngrxProviders } from './ngrx.providers';
import { ngneatDialogProviders } from './ngneatDialog.providers';
import { imageLoaderProviders } from './imageLoader.providers';

export type AppProvider = (Provider | EnvironmentProviders)[];

export const APP_PROVIDERS: AppProvider = [
  ...angularProviders,
  ...ngrxProviders,
  ...errorTailorProviders,
  ...ngneatDialogProviders,
  ...imageLoaderProviders,
] as const;
