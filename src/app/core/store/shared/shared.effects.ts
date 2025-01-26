import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SHARED_ACTIONS } from './shared.action';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { ToastCliorComponent } from '../../../shared/components/toast-clior/toast-clior.component';
import { handlerError } from '../../../shared/utils/handleError';

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

/**
 * Show Toast Effect
 * This effect is responsible for showing a toast message.
 * It takes the showToast action, and then shows the toast message.
 */

export const showToastEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(SHARED_ACTIONS.showToast),
      tap(({ message }) => {
        toast.custom(ToastCliorComponent, {
          componentProps: { message },
        });
      }),
    );
  },
  { dispatch: false, functional: true },
);

/**
 * Handle Error Effect
 * This effect is responsible for handling errors.
 * It takes the handleError action, and then shows the toast message.
 */
export const handleErrorEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(SHARED_ACTIONS.handleError),
      tap(({ error }) => {
        handlerError(error);
      }),
    );
  },
  { dispatch: false, functional: true },
);
