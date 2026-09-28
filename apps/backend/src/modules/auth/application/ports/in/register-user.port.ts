import type { RegisterUserInput } from '../../types/auth.types';

export abstract class RegisterUserPort {
  abstract execute(input: RegisterUserInput): Promise<void>;
}
