import { HttpErrorResponse, HttpContextToken, type HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../shared/http/api-base-url.token';
import { SessionService } from '../session/session.service';

const RETRIED = new HttpContextToken<boolean>(() => false);

const AUTH_ENDPOINTS =
  /\/auth\/(login|refresh|register|verify-email|resend-verification|forgot-password|reset-password|logout)$/;

/**
 * Attaches the in-memory bearer token to API calls and, on a 401, runs the
 * shared single-flight refresh and retries the original request exactly once.
 * Server-side rendering passes through untouched: no auth traffic during
 * prerender.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (isPlatformServer(inject(PLATFORM_ID))) return next(req);

  const session = inject(SessionService);
  const baseUrl = inject(API_BASE_URL);
  const isApi = req.url.startsWith(baseUrl);
  const isAuthEndpoint = AUTH_ENDPOINTS.test(req.url);

  const withToken = (request: typeof req) => {
    const token = session.token();
    return token && isApi && !isAuthEndpoint
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;
  };

  return next(withToken(req)).pipe(
    catchError((error: unknown) => {
      const canRefresh =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApi &&
        !isAuthEndpoint &&
        !req.context.get(RETRIED);

      if (!canRefresh) return throwError(() => error);

      return session.refresh().pipe(
        switchMap(() =>
          next(withToken(req.clone({ context: req.context.set(RETRIED, true) }))),
        ),
        catchError(() => throwError(() => error)),
      );
    }),
  );
};