import type { AuthUser } from '../../domain/models/auth-user';
import type { CurrentUser } from '../types/auth.types';

export class CurrentUserMapper {
  private constructor() {
    throw new Error('CurrentUserMapper is a static utility class');
  }

  static toCurrentUser(user: AuthUser): CurrentUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
