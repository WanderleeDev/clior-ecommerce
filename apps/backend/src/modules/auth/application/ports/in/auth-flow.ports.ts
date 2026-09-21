import type { AuthUser } from '../../../domain/models/auth-user';

export abstract class RefreshAuthPort {
  abstract execute(token: string): Promise<unknown>;
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
