import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SHARED_ACTIONS } from './shared.action';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Redirect to Effect
 * This effect is responsible for redirecting to a given URL.
 * It takes the redirectTo action, and then navigates to the given URL.
 */

export const redirectToEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(SHARED_ACTIONS.redirectTo),
      tap(({ url, params }) => {
        if (!params) {
          return router.navigateByUrl(url);
        }

        return router.navigate([url, params]);
      }),
    );
  },
  { dispatch: false, functional: true },
);
