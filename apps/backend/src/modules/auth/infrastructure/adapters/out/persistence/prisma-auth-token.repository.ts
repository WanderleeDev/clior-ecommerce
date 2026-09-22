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
    const token = await this.prisma.authToken.findFirst({
      where: { tokenHash, type, consumedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!token) return undefined;
    await this.prisma.authToken.update({ where: { id: token.id }, data: { consumedAt: new Date() } });
    return { userId: token.userId };
  }
}
