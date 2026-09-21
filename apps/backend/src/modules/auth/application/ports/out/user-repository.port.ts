import type { AuthUser, AuthUserWithPassword } from '../../../domain/models/auth-user';
import type { RegisterUserInput } from '../../types/auth.types';

export abstract class UserRepositoryPort {
  abstract create(input: RegisterUserInput & { passwordHash: string }): Promise<AuthUser>;
  abstract findByEmail(email: string): Promise<AuthUserWithPassword | undefined>;
  abstract findById(id: string): Promise<AuthUser | undefined>;
}
