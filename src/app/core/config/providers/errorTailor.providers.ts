import { provideErrorTailorConfig } from '@ngneat/error-tailor';
import { AppProvider } from '.';
import { ErrorLabelComponent } from '../../../shared/components/error-label/error-label.component';

export const errorTailorProviders: AppProvider = [
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
        password: 'Must be at least 6 characters long',
        confirmPassword: 'Do not match',
        CheckboxRequiredValidator: 'You must agree to the terms and conditions',
        pattern: 'Enter a valid format as indicated at the start',
        min: ({ min, actual }) =>
          `A minimum value of ${min} but you have is ${actual}`,
      },
    },
    controlErrorComponent: ErrorLabelComponent,
    controlErrorsOn: {
      change: true,
    },
  }),
];
