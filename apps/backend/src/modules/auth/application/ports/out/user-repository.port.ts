import type { AuthUser, AuthUserWithPassword } from '../../../domain/models/auth-user';
import type { RegisterUserInput } from '../../types/auth.types';

export abstract class UserRepositoryPort {
  abstract create(input: RegisterUserInput & { passwordHash: string }): Promise<AuthUser>;
  abstract findByEmail(email: string): Promise<AuthUserWithPassword | null>;
  abstract findById(id: string): Promise<AuthUser | null>;
  abstract markEmailVerified(id: string): Promise<void>;
  abstract updatePassword(id: string, passwordHash: string): Promise<void>;
  abstract recordFailedLogin(id: string, attempts: number, lockedUntil: Date | null): Promise<void>;
  abstract resetFailedLogins(id: string): Promise<void>;
}
