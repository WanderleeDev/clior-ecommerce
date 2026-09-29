import type { AuthOneTimeTokenType } from '../../types/auth.types';

export abstract class AuthTokenRepositoryPort {
  abstract create(input: {
    userId: string;
    type: AuthOneTimeTokenType;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  abstract consume(tokenHash: string, type: AuthOneTimeTokenType): Promise<{ userId: string } | undefined>;

  /**
   * Revokes every outstanding (not yet consumed) token of the given user and
   * type, e.g. when a password-reset request supersedes previously issued
   * tokens (M9).
   *
   * Declared optional so existing `implements AuthTokenRepositoryPort`
   * test fakes stay source-compatible; persistence adapters must provide it —
   * see PrismaAuthTokenRepository. Callers use an optional call (`?.`), so a
   * port without the method silently skips revocation.
   */
  revokeByUserAndType?(_userId: string, _type: AuthOneTimeTokenType): Promise<void>;
}
