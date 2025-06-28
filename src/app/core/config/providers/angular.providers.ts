import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { routes } from '../../../app.routes';
import { AppProvider } from '.';

export const angularProviders: AppProvider = [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
  provideClientHydration(withEventReplay()),
  provideHttpClient(withFetch()),
];
