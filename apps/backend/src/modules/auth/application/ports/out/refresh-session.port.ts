import type { RefreshSessionResult } from '../../types/auth.types';

export abstract class RefreshSessionPort {
  abstract create(userId: string): Promise<RefreshSessionResult>;
  abstract rotate(token: string): Promise<RefreshSessionResult>;
  abstract revoke(token: string): Promise<void>;
  abstract revokeAllForUser(userId: string): Promise<void>;
}
