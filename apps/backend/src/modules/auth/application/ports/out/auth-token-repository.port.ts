import type { AuthOneTimeTokenType } from '../../types/auth.types';

export abstract class AuthTokenRepositoryPort {
  abstract create(input: {
    userId: string;
    type: AuthOneTimeTokenType;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  abstract consume(tokenHash: string, type: AuthOneTimeTokenType): Promise<{ userId: string } | undefined>;
}
