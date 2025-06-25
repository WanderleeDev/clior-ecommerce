import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Clior | Home',
        loadComponent: () => import('./modules/home/views/home-view.component'),
      },
      {
        path: 'products',
        title: 'Clior | Products',
        loadChildren: () => import('./modules/product/product.routing'),
      },
      {
        path: 'shopping-cart',
        title: 'Clior | Shopping Cart',
        loadComponent: () =>
          import('./modules/shopping-cart/view/shopping-cart.component'),
      },
      {
        path: 'auth',
        title: 'Clior | Authentication',
        loadChildren: () => import('./modules/auth/auth.routes'),
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        title: 'Clior | Profile',
        loadComponent: () => import('./pages/profile/profile.component'),
        canActivate: [authGuard],
      },
      {
        path: 'contact',
        title: 'Clior | Contact',
        loadComponent: () =>
          import('./modules/contact/views/contact.component'),
      },
      {
        path: 'payments',
        title: 'Clior | Payments',
        loadComponent: () => import('./pages/payments/payments.component'),
      },
    ],
  },
  {
    path: 'cms',
    loadComponent: () => import('./pages/cms/cms.component'),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
    title: 'Not Found',
  },
];
