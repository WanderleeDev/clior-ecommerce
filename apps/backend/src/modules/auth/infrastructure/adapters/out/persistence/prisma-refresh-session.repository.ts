import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../prisma/prisma.service';
import { RefreshSessionPort } from '../../../../application/ports/out/refresh-session.port';
import { OpaqueTokenPort } from '../../../../application/ports/out/opaque-token.port';
import { TokenServicePort } from '../../../../application/ports/out/token-service.port';
import { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';
import type { RefreshSessionResult } from '../../../../application/types/auth.types';
import type { AuthUser } from '../../../../domain/models/auth-user';
import { InvalidRefreshTokenError } from '../../../../domain/errors/auth-flow.errors';

const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class PrismaRefreshSessionRepository extends RefreshSessionPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: OpaqueTokenPort,
    private readonly accessTokens: TokenServicePort,
    private readonly users: UserRepositoryPort,
  ) {
    super();
  }

  async create(userId: string): Promise<RefreshSessionResult> {
    const user = await this.users.findById(userId);
    if (!user) throw new InvalidRefreshTokenError('User not found');
    const raw = this.tokens.generate();
    await this.prisma.refreshSession.create({
      data: {
        userId,
        familyId: this.tokens.generate(),
        tokenHash: this.tokens.hash(raw),
        expiresAt: new Date(Date.now() + REFRESH_TTL),
      },
    });
    return this.result(user, raw);
  }

  async rotate(raw: string): Promise<RefreshSessionResult> {
    const session = await this.prisma.refreshSession.findUnique({ where: { tokenHash: this.tokens.hash(raw) } });
    if (!session || session.expiresAt <= new Date()) throw new InvalidRefreshTokenError();
    if (session.revokedAt) {
      await this.prisma.refreshSession.updateMany({ where: { familyId: session.familyId, revokedAt: null }, data: { revokedAt: new Date() } });
      throw new InvalidRefreshTokenError('Refresh token reuse detected');
    }
    await this.prisma.refreshSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    const user = await this.users.findById(session.userId);
    if (!user) throw new InvalidRefreshTokenError('User not found');
    const next = this.tokens.generate();
    await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        familyId: session.familyId,
        tokenHash: this.tokens.hash(next),
        expiresAt: new Date(Date.now() + REFRESH_TTL),
      },
    });
    return this.result(user, next);
  }

  async revoke(raw: string): Promise<void> {
    await this.prisma.refreshSession.updateMany({ where: { tokenHash: this.tokens.hash(raw), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  private async result(user: AuthUser, refreshToken: string): Promise<RefreshSessionResult> {
    return {
      accessToken: await this.accessTokens.sign({ sub: user.id, email: user.email, role: user.role }),
      refreshToken,
      user,
    };
  }
}
