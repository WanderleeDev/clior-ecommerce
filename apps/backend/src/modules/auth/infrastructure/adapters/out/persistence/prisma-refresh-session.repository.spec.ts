jest.mock('src/generated/prisma/client', () => ({ PrismaClient: class PrismaClient {} }), { virtual: true });

import { PrismaRefreshSessionRepository } from './prisma-refresh-session.repository';
import type { PrismaService } from '../../../../../../prisma/prisma.service';
import type { OpaqueTokenPort } from '../../../../application/ports/out/opaque-token.port';
import type { TokenServicePort } from '../../../../application/ports/out/token-service.port';
import type { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';
import type { AuthUser } from '../../../../domain/models/auth-user';
import { InvalidRefreshTokenError } from '../../../../domain/errors/auth-flow.errors';

const DAY = 24 * 60 * 60 * 1000;

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

type SessionRow = {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

function matchesWhere(row: SessionRow, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, condition]) => {
    if (condition === null) return row[key as keyof SessionRow] === null;
    return row[key as keyof SessionRow] === condition;
  });
}

/**
 * In-memory stand-in for PrismaSessionClient. Every operation yields to the
 * event loop first (like real I/O) so concurrent callers interleave, while the
 * mutation itself stays atomic within a single tick.
 */
class FakeRefreshPrisma {
  readonly sessions: SessionRow[] = [];
  private seq = 0;

  private tick(): Promise<void> {
    return new Promise((resolve) => setImmediate(resolve));
  }

  async $transaction<R>(fn: (tx: FakeRefreshPrisma) => Promise<R>): Promise<R> {
    await this.tick();
    return fn(this);
  }

  readonly refreshSession = {
    findUnique: async ({ where }: { where: { tokenHash: string } }): Promise<SessionRow | null> => {
      await this.tick();
      return this.sessions.find((row) => row.tokenHash === where.tokenHash) ?? null;
    },
    findFirst: async ({ where }: { where: Record<string, unknown> }): Promise<SessionRow | null> => {
      await this.tick();
      return this.sessions.find((row) => matchesWhere(row, where)) ?? null;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<SessionRow> }): Promise<SessionRow> => {
      await this.tick();
      const row = this.sessions.find((candidate) => candidate.id === where.id);
      if (!row) throw new Error('Record to update not found.');
      Object.assign(row, data);
      return row;
    },
    updateMany: async ({
      where,
      data,
    }: {
      where: Record<string, unknown>;
      data: Partial<SessionRow>;
    }): Promise<{ count: number }> => {
      await this.tick();
      const matched = this.sessions.filter((row) => matchesWhere(row, where));
      for (const row of matched) Object.assign(row, data);
      return { count: matched.length };
    },
    create: async ({ data }: { data: Omit<SessionRow, 'id' | 'revokedAt' | 'createdAt'> }): Promise<SessionRow> => {
      await this.tick();
      const row: SessionRow = {
        id: `session-${++this.seq}`,
        revokedAt: null,
        createdAt: new Date(),
        ...data,
      };
      this.sessions.push(row);
      return row;
    },
    aggregate: async ({ where }: { where: Record<string, unknown> }): Promise<{ _min: { createdAt: Date | null } }> => {
      await this.tick();
      const matched = this.sessions.filter((row) => matchesWhere(row, where));
      const timestamps = matched.map((row) => row.createdAt.getTime());
      return { _min: { createdAt: timestamps.length ? new Date(Math.min(...timestamps)) : null } };
    },
  };
}

function buildRepository(): {
  repository: PrismaRefreshSessionRepository;
  fake: FakeRefreshPrisma;
  signSpy: jest.Mock;
} {
  const fake = new FakeRefreshPrisma();
  let counter = 0;
  const tokens = {
    generate: () => `raw-${++counter}`,
    hash: (token: string) => `hash:${token}`,
  } as OpaqueTokenPort;
  const signSpy = jest.fn().mockResolvedValue('signed-access-token');
  const tokenService = { sign: signSpy } as unknown as TokenServicePort;
  const users = {
    findById: async (id: string) => (id === user.id ? user : null),
  } as unknown as UserRepositoryPort;

  return {
    repository: new PrismaRefreshSessionRepository(fake as unknown as PrismaService, tokens, tokenService, users),
    fake,
    signSpy,
  };
}

describe('PrismaRefreshSessionRepository', () => {
  describe('rotate() concurrency (H1)', () => {
    it('lets only one of two concurrent rotations with the same cookie win', async () => {
      const { repository, fake } = buildRepository();
      const created = await repository.create(user.id);

      const results = await Promise.allSettled([
        repository.rotate(created.refreshToken),
        repository.rotate(created.refreshToken),
      ]);

      const fulfilled = results.filter((result) => result.status === 'fulfilled');
      const rejected = results.filter((result) => result.status === 'rejected');

      expect(fulfilled).toHaveLength(1);
      expect(rejected).toHaveLength(1);
      expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(InvalidRefreshTokenError);
      // One-active-token-per-family must hold even under the race (the loser
      // takes the reuse path, which revokes the family — depending on the
      // interleaving the winner's new row may already be revoked too).
      expect(fake.sessions.filter((row) => row.revokedAt === null).length).toBeLessThanOrEqual(1);
    });

    it('revokes the whole family when a rotated token is presented again', async () => {
      const { repository, fake } = buildRepository();
      const created = await repository.create(user.id);

      const rotated = await repository.rotate(created.refreshToken);
      expect(rotated.refreshToken).not.toBe(created.refreshToken);

      await expect(repository.rotate(created.refreshToken)).rejects.toThrow('reuse detected');
      expect(fake.sessions.filter((row) => row.revokedAt === null)).toHaveLength(0);
    });

    it('keeps rotating within the family while the session is valid', async () => {
      const { repository, fake } = buildRepository();
      const created = await repository.create(user.id);
      const originalFamily = fake.sessions[0].familyId;

      const rotated = await repository.rotate(created.refreshToken);

      expect(rotated.user.id).toBe(user.id);
      const next = fake.sessions.find((row) => row.tokenHash === `hash:${rotated.refreshToken}`);
      expect(next).toBeDefined();
      expect(next?.familyId).toBe(originalFamily);
      expect(next?.expiresAt.getTime()).toBeGreaterThan(Date.now() + 29 * DAY);
      // The presented token is single-use.
      expect(fake.sessions.find((row) => row.tokenHash === `hash:${created.refreshToken}`)?.revokedAt).not.toBeNull();
    });

    it('rejects an expired refresh token', async () => {
      const { repository, fake } = buildRepository();
      await repository.create(user.id);
      fake.sessions[0].expiresAt = new Date(Date.now() - 1000);

      await expect(repository.rotate(fake.sessions[0].tokenHash.replace(/^hash:/, ''))).rejects.toThrow(
        InvalidRefreshTokenError,
      );
    });
  });

  describe('absolute session lifetime (L19)', () => {
    it('refuses to rotate a family older than the absolute lifetime', async () => {
      const { repository, fake } = buildRepository();
      const created = await repository.create(user.id);

      // Simulate a family that has been sliding for 100 days (> 90-day cap).
      for (const row of fake.sessions) row.createdAt = new Date(Date.now() - 100 * DAY);

      await expect(repository.rotate(created.refreshToken)).rejects.toThrow(/absolute lifetime/);
      expect(fake.sessions.filter((row) => row.revokedAt === null)).toHaveLength(0);
    });
  });

  describe('access token payload (L16)', () => {
    it('signs only the subject claim — no email PII, no dead role claim', async () => {
      const { repository, signSpy } = buildRepository();

      await repository.create(user.id);

      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith({ sub: user.id });
    });
  });
});
