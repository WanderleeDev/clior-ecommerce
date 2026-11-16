export type AuthErrorCode =
  | 'email_taken'
  | 'invalid_token'
  | 'throttled'
  | 'validation'
  | 'unknown';

/**
 * Typed, already-translated failure for auth screens.
 *
 * Views never inspect HTTP status codes or raw API messages: the adapter maps
 * the transport shape once, so every screen shows consistent Spanish copy.
 */
export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
