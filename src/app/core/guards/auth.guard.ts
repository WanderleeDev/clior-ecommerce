import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const fakeLogin = true;

  if (!fakeLogin) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
