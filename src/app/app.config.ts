import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideErrorTailorConfig } from '@ngneat/error-tailor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideErrorTailorConfig({
      errors: {
        useValue: {
          404: 'Page not found',
          500: 'Server error',
          required: 'This field is required',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: (e) => `Address isn't valid: ${e}`,
          email: 'Please enter a valid email address',
          password: 'XXXXXXXX must be at least 6 characters long',
          confirmPassword: 'XXXXXXXXX do not match',
          CheckboxRequiredValidator:
            'You must agree to the terms and conditions',
          pattern: 'Enter a valid format as indicated at the start',
          min: ({ min, actual }) =>
            `A minimum value of ${min} but you have is ${actual}`,
        },
      },
      controlErrorsOn: {
        change: true,
      },
    }),
  ],
};
