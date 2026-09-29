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
// Absolute cap for a refresh-token family: rotations keep the session alive
// indefinitely otherwise, so the family must die after this window (L19).
const ABSOLUTE_SESSION_TTL = 90 * 24 * 60 * 60 * 1000;

type RefreshSessionClient = Pick<PrismaService, 'refreshSession'>;

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
    const tokenHash = this.tokens.hash(raw);
    // One transaction + a conditional claim: of two concurrent rotations with
    // the same cookie, exactly one wins the claim; the loser takes the
    // reuse path and the family is revoked (H1).
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const session = await tx.refreshSession.findUnique({ where: { tokenHash } });
      if (!session || session.expiresAt <= now) throw new InvalidRefreshTokenError();
      if (session.revokedAt) {
        await this.revokeFamily(tx, session.familyId);
        throw new InvalidRefreshTokenError('Refresh token reuse detected');
      }

      // Absolute lifetime is anchored to the oldest row of the family, so
      // sliding rotations cannot extend a session past the cap (L19).
      const anchor = await tx.refreshSession.aggregate({
        where: { familyId: session.familyId },
        _min: { createdAt: true },
      });
      const familyStartedAt = anchor._min.createdAt;
      if (!familyStartedAt || now.getTime() - familyStartedAt.getTime() > ABSOLUTE_SESSION_TTL) {
        await this.revokeFamily(tx, session.familyId);
        throw new InvalidRefreshTokenError('Refresh session reached its absolute lifetime');
      }

      const claimed = await tx.refreshSession.updateMany({
        where: { id: session.id, revokedAt: null },
        data: { revokedAt: now },
      });
      if (claimed.count !== 1) {
        await this.revokeFamily(tx, session.familyId);
        throw new InvalidRefreshTokenError('Refresh token reuse detected');
      }

      const user = await this.users.findById(session.userId);
      if (!user) throw new InvalidRefreshTokenError('User not found');
      const next = this.tokens.generate();
      await tx.refreshSession.create({
        data: {
          userId: user.id,
          familyId: session.familyId,
          tokenHash: this.tokens.hash(next),
          expiresAt: new Date(now.getTime() + REFRESH_TTL),
        },
      });
      return this.result(user, next);
    });
  }

  async revoke(raw: string): Promise<void> {
    await this.prisma.refreshSession.updateMany({ where: { tokenHash: this.tokens.hash(raw), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  private async revokeFamily(tx: RefreshSessionClient, familyId: string): Promise<void> {
    await tx.refreshSession.updateMany({ where: { familyId, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  private async result(user: AuthUser, refreshToken: string): Promise<RefreshSessionResult> {
    // L16: the access token carries only the subject claim. The email is PII
    // and the role claim is dead — JwtStrategy re-reads the role from the DB.
    return {
      accessToken: await this.accessTokens.sign({ sub: user.id }),
      refreshToken,
      user,
    };
  }
}
