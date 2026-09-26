import type { AuthUser } from '../../../domain/models/auth-user';
import type { CurrentUser } from '../../types/auth.types';

export abstract class GetCurrentUserPort {
  abstract execute(user: AuthUser): Promise<CurrentUser>;
}
