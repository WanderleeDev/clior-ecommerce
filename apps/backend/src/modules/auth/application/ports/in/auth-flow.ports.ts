import type { AuthUser } from '../../../domain/models/auth-user';
import type { RefreshSessionResult } from '../../types/auth.types';

export abstract class RefreshAuthPort {
  abstract execute(token: string): Promise<RefreshSessionResult>;
}

export abstract class LogoutPort {
  abstract execute(token: string): Promise<void>;
}

export abstract class VerifyEmailPort {
  abstract execute(token: string): Promise<void>;
}

export abstract class RequestVerificationPort {
  abstract execute(email: string): Promise<void>;
}

export abstract class RequestPasswordResetPort {
  abstract execute(email: string): Promise<void>;
}

export abstract class ResetPasswordPort {
  abstract execute(token: string, password: string): Promise<void>;
}

export abstract class RoleAuthorizationPort {
  abstract hasRole(user: AuthUser, roles: string[]): boolean;
}
