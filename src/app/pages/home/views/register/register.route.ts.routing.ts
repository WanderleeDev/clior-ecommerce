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
    title: 'Register - Step 1',
  },
  {
    path: 'step-2',
    loadComponent: () => import('./views/account-form/account-form.component'),
    title: 'Register - Step 2',
  },
  {
    path: 'step-3',
    loadComponent: () =>
      import('./views/confirmation-form/confirmation-form.component'),
    title: 'Register - Step 3',
  },
];

export default REGISTER_ROUTES;
