import { HttpErrorResponse } from '@angular/common/http';
import { AuthError } from '../../domain/errors/auth.error';
import { toAuthError } from './auth-error.mapper';

function httpError(status: number, body: unknown): HttpErrorResponse {
  return new HttpErrorResponse({ status, error: body, url: '/api/auth/register' });
}

describe('toAuthError', () => {
  it('maps a duplicate account to a Spanish message with a login hint', () => {
    const error = toAuthError(httpError(409, { message: 'Email is already registered' }));

    expect(error).toBeInstanceOf(AuthError);
    expect(error.code).toBe('email_taken');
    expect(error.message).toContain('Inicia sesión');
  });

  it('maps throttling to a retry hint instead of the raw 429', () => {
    const error = toAuthError(httpError(429, { message: 'ThrottlerException: Too Many Requests' }));

    expect(error.code).toBe('throttled');
    expect(error.message).toContain('Espera un minuto');
  });

  it('maps an expired or reused token to the resend hint', () => {
    const error = toAuthError(httpError(400, { message: 'Invalid or expired token' }));

    expect(error.code).toBe('invalid_token');
    expect(error.message).toContain('venció');
  });

  it('maps class-validator failures to the generic validation message', () => {
    const error = toAuthError(httpError(400, { message: ['password must be stronger'] }));

    expect(error.code).toBe('validation');
  });

  it('never leaks the English API message to the view', () => {
    const error = toAuthError(httpError(500, { message: 'Internal server error' }));

    expect(error.code).toBe('unknown');
    expect(error.message).not.toContain('Internal');
  });

  it('treats a non-HTTP failure as unknown', () => {
    expect(toAuthError(new Error('boom')).code).toBe('unknown');
  });
});
