import { HttpErrorResponse } from '@angular/common/http';
import { AuthError } from '../../domain/errors/auth.error';

const MESSAGES = {
  emailTaken: 'Ese email ya está registrado. Inicia sesión para continuar.',
  invalidToken: 'El enlace no es válido o ya venció. Pide uno nuevo.',
  throttled: 'Demasiados intentos. Espera un minuto y vuelve a probar.',
  validation: 'Revisa los datos del formulario e intenta de nuevo.',
  unknown: 'No pudimos completar la operación. Intenta de nuevo.',
} as const;

/**
 * Translates the API error envelope into typed, Spanish, view-ready errors.
 *
 * The API answers `{ statusCode, message }` where `message` is either the
 * fixed public string or, for class-validator failures, an array of English
 * field messages. Views must never see either shape.
 */
export function toAuthError(error: unknown): AuthError {
  if (!(error instanceof HttpErrorResponse)) {
    return new AuthError('unknown', MESSAGES.unknown);
  }

  switch (error.status) {
    case 409:
      return new AuthError('email_taken', MESSAGES.emailTaken);
    case 429:
      return new AuthError('throttled', MESSAGES.throttled);
    case 400: {
      const body: unknown = error.error;
      const message =
        typeof body === 'object' && body !== null && 'message' in body
          ? (body as { message: unknown }).message
          : undefined;

      if (typeof message === 'string' && /token/i.test(message)) {
        return new AuthError('invalid_token', MESSAGES.invalidToken);
      }
      return new AuthError('validation', MESSAGES.validation);
    }
    default:
      return new AuthError('unknown', MESSAGES.unknown);
  }
}
