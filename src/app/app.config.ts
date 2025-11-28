import { ApplicationConfig } from '@angular/core';
import { APP_PROVIDERS } from './core/config/providers';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
    providers: [...APP_PROVIDERS, provideStore()]
};
