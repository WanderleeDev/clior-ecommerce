import { Routes } from '@angular/router';

const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/products/products.component'),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./views/product-overview/product-overview.component'),
  },
];

export default PRODUCT_ROUTES;
