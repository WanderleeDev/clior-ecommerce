import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, finalize, map, shareReplay, throwError, type Observable } from 'rxjs';
import { API_BASE_URL } from '../../../shared/http/api-base-url.token';
import type { User } from '../../domain/models/auth.model';
import { toAuthError } from '../adapters/auth-error.mapper';
import { toUser, type ApiUser } from '../adapters/auth-user.mapper';

interface SessionResponse {
  accessToken: string;
  user: ApiUser;
}

/**
 * In-memory access token plus the single-flight refresh used by both the
 * app bootstrap and the 401 interceptor. The refresh token itself never
 * reaches JavaScript: it lives in the httpOnly cookie.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  private accessToken: string | null = null;
  private inFlight: Observable<User> | null = null;

  token(): string | null {
    return this.accessToken;
  }

  setToken(token: string): void {
    this.accessToken = token;
  }

  clear(): void {
    this.accessToken = null;
  }

  refresh(): Observable<User> {
    if (this.inFlight) return this.inFlight;

    this.inFlight = this.http
      .post<SessionResponse>(`${this.baseUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        map((response) => {
          this.accessToken = response.accessToken;
          return toUser(response.user);
        }),
        catchError((error: unknown) => {
          this.clear();
          return throwError(() => toAuthError(error));
        }),
        finalize(() => {
          this.inFlight = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    return this.inFlight;
  }
}