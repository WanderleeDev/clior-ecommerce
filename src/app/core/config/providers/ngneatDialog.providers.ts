import { provideDialogConfig } from '@ngneat/dialog';
import { AppProvider } from '.';

export const ngneatDialogProviders: AppProvider = [
  provideDialogConfig({
    closeButton: false,
    backdrop: true,
    overflow: false,
  }),
];
