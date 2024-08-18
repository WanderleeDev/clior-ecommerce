import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routing')
  },
  {
    path: 'cms',
    loadComponent: () => import('./pages/cms/cms.component')
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
    title: 'Not Found',
  },
];
