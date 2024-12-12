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
        loadComponent: () => import('./pages/home/home.component'),
      },
      {
        path: 'products',
        title: 'Clior | Products',
        loadChildren: () => import('./pages/product/product.routing'),
      },
      {
        path: 'auth',
        title: 'Clior | Authentication',
        loadChildren: () => import('./pages/auth/auth.routes'),
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
        loadComponent: () => import('./pages/contact/contact.component'),
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
