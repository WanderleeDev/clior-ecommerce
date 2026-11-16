import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { iconSubset } from '../ngx-iconify/icon-subset';
import { provideIconify } from 'ngx-iconify-stack';
import { provideThemeStack } from 'ngx-theme-stack';
import {
  ApplicationConfig,
  PLATFORM_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { ProductRepositoryPort } from './products/domain/ports/out/product-repository.port';
import { MockProductAdapter } from './products/infrastructure/adapters/mock-product.adapter';
import { AuthUsecase } from './auth/domain/ports/in/auth.usecase';
import { AuthUseCase } from './auth/application/auth.use-case';
import { AuthRepositoryPort } from './auth/domain/ports/out/auth-repository.port';
import { HttpAuthAdapter } from './auth/infrastructure/adapters/http-auth.adapter';
import { authInterceptor } from './auth/infrastructure/http/auth.interceptor';
import { SessionService } from './auth/infrastructure/session/session.service';
import { AuthStore } from './auth/presentation/state/auth.store';
import { RegistrationRepositoryPort } from './auth/domain/ports/out/registration-repository.port';
import { HttpRegistrationAdapter } from './auth/infrastructure/adapters/http-registration.adapter';
import { ViewProductsUsecase } from './products/domain/ports/in/view-products.usecase';
import { ViewProductsUseCase } from './products/application/view-products.use-case';
import { ProductDomainService } from './products/domain/services/product-domain.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(appRoutes), provideThemeStack({
      themes: ['system', 'light', 'dark', 'mascotas'] as const,
      defaultTheme: 'system',
      storageKey: 'ngx-theme-stack',
      mode: 'class',
      strategy: 'critters',
    }), provideIconify({ offlineCollections: iconSubset }),
    ProductDomainService,
    { provide: ProductRepositoryPort, useClass: MockProductAdapter },
    { provide: AuthRepositoryPort, useClass: HttpAuthAdapter },
    { provide: RegistrationRepositoryPort, useClass: HttpRegistrationAdapter },
    { provide: AuthUsecase, useClass: AuthUseCase },
    { provide: ViewProductsUsecase, useClass: ViewProductsUseCase },
    provideAppInitializer(() => {
      // Returning users are hydrated from the refresh cookie before the first
      // navigation; prerender/SSR must never issue auth traffic.
      if (isPlatformServer(inject(PLATFORM_ID))) return;
      const session = inject(SessionService);
      const store = inject(AuthStore);
      return firstValueFrom(
        session.refresh().pipe(
          tap((user) => store.set(user)),
          catchError(() => of(null)),
        ),
      );
    }),
  ],
};