import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/models/App.model';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const store = inject(Store<AppState>);
  const isAuthenticated = store.selectSignal(selectIsAuthenticated);

  if (state.url.includes('/auth') && isAuthenticated()) {
    return router.createUrlTree(['/profile']);
  }

  if (state.url.includes('/profile') && !isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
