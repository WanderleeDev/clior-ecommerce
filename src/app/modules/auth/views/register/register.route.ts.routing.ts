import { Routes } from '@angular/router';

const REGISTER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'step-1',
    pathMatch: 'full',
  },
  {
    path: 'step-1',
    loadComponent: () =>
      import('./views/personal-info-form/personal-info-form.component'),
    title: 'Register - Personal Info',
  },
  {
    path: 'step-2',
    loadComponent: () => import('./views/account/account.component'),
    title: 'Register - Account Info',
  },
  {
    path: 'step-3',
    loadComponent: () => import('./views/confirmation/confirmation.component'),
    title: 'Register - Confirmation',
  },
];

export default REGISTER_ROUTES;
