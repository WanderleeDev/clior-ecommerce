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
  user: AuthUser;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
}
