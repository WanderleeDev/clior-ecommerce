import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, finalize, map, of, throwError, type Observable } from 'rxjs';
import { API_BASE_URL } from '../../../shared/http/api-base-url.token';
import type { LoginCredentials, RecoverData, User } from '../../domain/models/auth.model';
import { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.port';
import { SessionService } from '../session/session.service';
import { toAuthError } from './auth-error.mapper';
import { toUser, type ApiUser } from './auth-user.mapper';

interface SessionResponse {
  accessToken: string;
  user: ApiUser;
}

@Injectable()
export class HttpAuthAdapter extends AuthRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly session = inject(SessionService);

  override login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<SessionResponse>(`${this.baseUrl}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        map((response) => {
          this.session.setToken(response.accessToken);
          return toUser(response.user);
        }),
        catchError((error: unknown) => throwError(() => toAuthError(error))),
      );
  }

  override recover(data: RecoverData): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/auth/forgot-password`, data, { withCredentials: true })
      .pipe(catchError((error: unknown) => throwError(() => toAuthError(error))));
  }

  override currentUser(): Observable<User | null> {
    if (!this.session.token()) return of(null);
    return this.http.get<ApiUser>(`${this.baseUrl}/auth/me`).pipe(
      map(toUser),
      catchError(() => of(null)),
    );
  }

  override logout(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        catchError((error: unknown) => throwError(() => toAuthError(error))),
        finalize(() => this.session.clear()),
      );
  }
}