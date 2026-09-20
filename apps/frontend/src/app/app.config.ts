import { iconSubset } from '../ngx-iconify/icon-subset';
import { provideIconify } from 'ngx-iconify-stack';
import { provideThemeStack } from 'ngx-theme-stack';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
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
import { MockAuthAdapter } from './auth/infrastructure/adapters/mock-auth.adapter';
import { ViewProductsUsecase } from './products/domain/ports/in/view-products.usecase';
import { ViewProductsUseCase } from './products/application/view-products.use-case';
import { ProductDomainService } from './products/domain/services/product-domain.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes), provideThemeStack({
      themes: ['system', 'light', 'dark', 'mascotas'] as const,
      defaultTheme: 'system',
      storageKey: 'ngx-theme-stack',
      mode: 'class',
      strategy: 'critters',
    }), provideIconify({ offlineCollections: iconSubset }),
    ProductDomainService,
    { provide: ProductRepositoryPort, useClass: MockProductAdapter },
    { provide: AuthRepositoryPort, useClass: MockAuthAdapter },
    {
      provide: AuthUsecase,
      useClass: AuthUseCase,
      deps: [AuthRepositoryPort],
    },
    {
      provide: ViewProductsUsecase,
      useClass: ViewProductsUseCase,
      deps: [ProductRepositoryPort, ProductDomainService],
    },
  ],
};
