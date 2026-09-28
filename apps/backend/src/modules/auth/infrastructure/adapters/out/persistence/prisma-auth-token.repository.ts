import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../prisma/prisma.service';
import { AuthTokenRepositoryPort } from '../../../../application/ports/out/auth-token-repository.port';
import type { AuthOneTimeTokenType } from '../../../../application/types/auth.types';

@Injectable()
export class PrismaAuthTokenRepository extends AuthTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: {
    userId: string;
    type: AuthOneTimeTokenType;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.authToken.create({ data: input });
  }

  async consume(tokenHash: string, type: AuthOneTimeTokenType): Promise<{ userId: string } | undefined> {
    const now = new Date();
    // Single conditional write: only one concurrent caller can flip
    // consumedAt, so the token is redeemable at most once (H2).
    const consumed = await this.prisma.authToken.updateMany({
      where: { tokenHash, type, consumedAt: null, expiresAt: { gt: now } },
      data: { consumedAt: now },
    });
    if (consumed.count !== 1) return undefined;
    const token = await this.prisma.authToken.findFirst({ where: { tokenHash, type } });
    return token ? { userId: token.userId } : undefined;
  }

  async revokeByUserAndType(userId: string, type: AuthOneTimeTokenType): Promise<void> {
    // AuthToken has no revokedAt column; consuming is the existing
    // "no longer redeemable" marker, so outstanding tokens are burned here.
    await this.prisma.authToken.updateMany({
      where: { userId, type, consumedAt: null },
      data: { consumedAt: new Date() },
    });
  }
}
