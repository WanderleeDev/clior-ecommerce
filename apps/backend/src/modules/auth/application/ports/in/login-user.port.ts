import type { AuthResult, LoginUserInput } from '../../types/auth.types';

export abstract class LoginUserPort {
  abstract execute(input: LoginUserInput): Promise<AuthResult>;
}
