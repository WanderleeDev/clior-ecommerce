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
      import('./views/register-step-1/register-step-1.component'),
    title: 'Register - Personal Info',
  },
  {
    path: 'step-2',
    loadComponent: () =>
      import('./views/register-step-2/register-step-2.component'),
    title: 'Register - Account Info',
  },
  {
    path: 'step-3',
    loadComponent: () =>
      import('./views/register-step-3/register-step-3.component'),
    title: 'Register - Confirmation',
  },
];

export default REGISTER_ROUTES;
