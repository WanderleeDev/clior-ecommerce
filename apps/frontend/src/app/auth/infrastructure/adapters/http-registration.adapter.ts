import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, type Observable, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../shared/http/api-base-url.token';
import type { RegisterData, RegisterResult } from '../../domain/models/auth.model';
import { RegistrationRepositoryPort } from '../../domain/ports/out/registration-repository.port';
import { toAuthError } from './auth-error.mapper';

@Injectable()
export class HttpRegistrationAdapter extends RegistrationRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  register(data: RegisterData): Observable<RegisterResult> {
    return this.http
      .post<RegisterResult>(`${this.baseUrl}/auth/register`, data, { withCredentials: true })
      .pipe(catchError((error: unknown) => throwError(() => toAuthError(error))));
  }

  verifyEmail(token: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/auth/verify-email`, { token })
      .pipe(catchError((error: unknown) => throwError(() => toAuthError(error))));
  }

  resendVerification(email: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/auth/resend-verification`, { email })
      .pipe(catchError((error: unknown) => throwError(() => toAuthError(error))));
  }
}
