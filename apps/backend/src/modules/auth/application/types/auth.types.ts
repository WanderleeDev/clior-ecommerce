import type { AuthUser } from '../../domain/models/auth-user';

export interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/**
 * Access-token claims. Deliberately minimal: the subject is the only claim
 * the API trusts — JwtStrategy loads the user (and role) from the database.
 */
export interface AuthTokenPayload {
  sub: string;
}

export type AuthOneTimeTokenType = 'email_verification' | 'password_reset';

export interface RefreshSessionResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
