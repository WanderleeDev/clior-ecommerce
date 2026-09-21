import type { AuthResult, RegisterUserInput } from '../../types/auth.types';

export abstract class RegisterUserPort {
  abstract execute(input: RegisterUserInput): Promise<AuthResult>;
}
