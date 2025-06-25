import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AUTH_ACTIONS } from './auth.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SHARED_ACTIONS } from '../shared/shared.action';

/**
 * Login Effect
 * This effect is responsible for handling the login process.
 * It takes the login action, and then calls the AuthService to login.
 * If the login is successful, it dispatches the loginSuccess action.
 * If the login fails, it dispatches the loginFailure action.
 */

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authSvc = inject(AuthService)) => {
    return actions$.pipe(
      ofType(AUTH_ACTIONS.login),
      exhaustMap(({ email, password }) =>
        authSvc.login({ email, password }).pipe(
          map((res) => {
            return AUTH_ACTIONS.loginSuccess({ credentials: res });
          }),
        ),
      ),
      catchError((err: HttpErrorResponse) => {
        return of(AUTH_ACTIONS.loginFailure({ error: [err.statusText] }));
      }),
    );
  },
  { functional: true },
);

/**
 * Auth Navigate Effect
 * This effect is responsible for navigating to the profile page after a successful login.
 * It takes the loginSuccess action, and then navigates to the profile page.
 */

export const authNavigateEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(AUTH_ACTIONS.loginSuccess),
      map(() => SHARED_ACTIONS.redirectTo({ url: '/profile' })),
    );
  },
  { functional: true },
);

/**
 * Logout Effect
 * This effect is responsible for navigating to the home page after a successful logout.
 * It takes the logout action, and then navigates to the home page.
 */

export const logoutEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(AUTH_ACTIONS.logout),
      map(() => SHARED_ACTIONS.redirectTo({ url: '/home' })),
    );
  },
  { functional: true },
);
