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
        email: 'Please enter a valid email address',
        pattern: 'Enter a valid format as indicated at the start',
        minlength: ({ requiredLength, actualLength }) =>
          `Expect ${requiredLength} but got ${actualLength}`,
        maxlength: ({ requiredLength, actualLength }) =>
          `Expect ${requiredLength} but got ${actualLength}`,
        min: ({ min, actual }) =>
          `A minimum value of ${min} but you have is ${actual}`,
        max: ({ max, actual }) =>
          `A maximum value of ${max} but you have is ${actual}`,
        invalidAddress: (e) => `Address isn't valid: ${e}`,
        password: 'Must be at least 6 characters long',
        confirmPassword: 'Do not match',
        CheckboxRequiredValidator: 'You must agree to the terms and conditions',
      },
    },
    controlErrorComponent: ErrorLabelComponent,
    controlErrorsOn: {
      change: true,
    },
  }),
];
