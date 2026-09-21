import type { AuthUser } from '../models/auth-user';

export const USER_REGISTERED_EVENT = 'auth.user-registered';
export const VERIFICATION_REQUESTED_EVENT = 'auth.verification-requested';
export const PASSWORD_RESET_REQUESTED_EVENT = 'auth.password-reset-requested';

export class UserRegisteredEvent {
  constructor(public readonly user: AuthUser) {}
}
