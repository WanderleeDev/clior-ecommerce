import { InjectionToken } from '@angular/core';

/**
 * Base URL for the Clior API.
 *
 * Defaults to a same-origin relative path: the dev server proxies `/api` to
 * the NestJS backend (see `apps/frontend/proxy.conf.json`), which keeps
 * cookies same-site and avoids CORS during local development.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
