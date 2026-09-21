import type { AuthUser } from '../models/auth-user';

export const USER_REGISTERED_EVENT = 'auth.user-registered';

export class UserRegisteredEvent {
  constructor(public readonly user: AuthUser) {}
}
