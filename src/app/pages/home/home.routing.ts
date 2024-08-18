import { Routes } from '@angular/router';

const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component'),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./views/entry/entry.component'),
      },
      {
        path: 'products',
        loadComponent: () => import('./views/products/products.component'),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./views/single-product/single-product.component'),
      },
      {
        path: 'new-products',
        loadComponent: () =>
          import('./views/new-products/new-products.component'),
      },
      {
        path: 'login',
        loadComponent: () => import('./views/login/login.component'),
      },
      {
        path: 'register',
        loadComponent: () => import('./views/register/register.component'),
        loadChildren: () =>
          import('./views/register/register.route.ts.routing'),
      },
    ],
  },
];

export default HOME_ROUTES;
