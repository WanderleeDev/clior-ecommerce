import { Routes } from '@angular/router';

const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component'),
  },
  {
    path: 'register',
    loadChildren: () => import('./register.routes'),
  },
];

export default AUTH_ROUTES;
