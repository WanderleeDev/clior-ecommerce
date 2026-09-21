import type { AuthUser } from '../../../domain/models/auth-user';

export abstract class GetCurrentUserPort {
  abstract execute(userId: string): Promise<AuthUser>;
}
