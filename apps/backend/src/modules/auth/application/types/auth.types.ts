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

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export type AuthOneTimeTokenType = 'email_verification' | 'password_reset';

export interface RefreshSessionResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
