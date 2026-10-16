jest.mock('src/generated/prisma/client', () => ({ PrismaClient: class PrismaClient {} }), { virtual: true });

import { PrismaAuthTokenRepository } from './prisma-auth-token.repository';
import type { PrismaService } from '../../../../../../prisma/prisma.service';
import type { AuthOneTimeTokenType } from '../../../../application/types/auth.types';

type TokenRow = {
  id: string;
  userId: string;
  type: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
};

function matchCondition(value: unknown, condition: unknown): boolean {
  if (condition === null) return value === null;
  if (condition instanceof Date) return value instanceof Date && value.getTime() === condition.getTime();
  if (typeof condition === 'object' && condition !== null && 'gt' in condition) {
    const boundary = (condition as { gt: Date }).gt;
    return value instanceof Date && value.getTime() > boundary.getTime();
  }
  return value === condition;
}

function matchesWhere(row: TokenRow, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, condition]) => matchCondition(row[key as keyof TokenRow], condition));
}

/**
 * In-memory stand-in for Prisma's AuthToken delegate. Each operation yields to
 * the event loop first (like real I/O) so concurrent callers interleave, while
 * the mutation itself stays atomic within a single tick.
 */
class FakeTokenPrisma {
  readonly tokens: TokenRow[] = [];
  private seq = 0;

  private tick(): Promise<void> {
    return new Promise((resolve) => setImmediate(resolve));
  }

  readonly authToken = {
    create: async ({ data }: { data: Omit<TokenRow, 'id' | 'consumedAt' | 'createdAt'> }): Promise<TokenRow> => {
      await this.tick();
      const row: TokenRow = { id: `token-${++this.seq}`, consumedAt: null, createdAt: new Date(), ...data };
      this.tokens.push(row);
      return row;
    },
    findFirst: async ({ where }: { where: Record<string, unknown> }): Promise<TokenRow | null> => {
      await this.tick();
      return this.tokens.find((row) => matchesWhere(row, where)) ?? null;
    },
    findUnique: async ({ where }: { where: { id: string } }): Promise<TokenRow | null> => {
      await this.tick();
      return this.tokens.find((row) => row.id === where.id) ?? null;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<TokenRow> }): Promise<TokenRow> => {
      await this.tick();
      const row = this.tokens.find((candidate) => candidate.id === where.id);
      if (!row) throw new Error('Record to update not found.');
      Object.assign(row, data);
      return row;
    },
    updateMany: async ({
      where,
      data,
    }: {
      where: Record<string, unknown>;
      data: Partial<TokenRow>;
    }): Promise<{ count: number }> => {
      await this.tick();
      const matched = this.tokens.filter((row) => matchesWhere(row, where));
      for (const row of matched) Object.assign(row, data);
      return { count: matched.length };
    },
  };
}

function buildRepository(): { repository: PrismaAuthTokenRepository; fake: FakeTokenPrisma } {
  const fake = new FakeTokenPrisma();
  return { repository: new PrismaAuthTokenRepository(fake as unknown as PrismaService), fake };
}

const future = (): Date => new Date(Date.now() + 60 * 1000);

describe('PrismaAuthTokenRepository', () => {
  describe('consume() concurrency (H2)', () => {
    it('redeems a one-time token at most once under concurrency', async () => {
      const { repository } = buildRepository();
      await repository.create({
        userId: 'user-1',
        type: 'password_reset',
        tokenHash: 'hash:reset-token',
        expiresAt: future(),
      });

      const results = await Promise.all([
        repository.consume('hash:reset-token', 'password_reset'),
        repository.consume('hash:reset-token', 'password_reset'),
      ]);

      const redeemed = results.filter((result) => result !== undefined);
      expect(redeemed).toEqual([{ userId: 'user-1' }]);
    });

    it('returns the owner exactly once when called twice in sequence', async () => {
      const { repository } = buildRepository();
      await repository.create({
        userId: 'user-1',
        type: 'password_reset',
        tokenHash: 'hash:reset-token',
        expiresAt: future(),
      });

      await expect(repository.consume('hash:reset-token', 'password_reset')).resolves.toEqual({ userId: 'user-1' });
      await expect(repository.consume('hash:reset-token', 'password_reset')).resolves.toBeUndefined();
    });
  });

  describe('consume() guards', () => {
    it('rejects an unknown token', async () => {
      const { repository } = buildRepository();
      await expect(repository.consume('hash:missing', 'password_reset')).resolves.toBeUndefined();
    });

    it('rejects an expired token', async () => {
      const { repository } = buildRepository();
      await repository.create({
        userId: 'user-1',
        type: 'password_reset',
        tokenHash: 'hash:expired',
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(repository.consume('hash:expired', 'password_reset')).resolves.toBeUndefined();
    });

    it('rejects a token of another type', async () => {
      const { repository } = buildRepository();
      await repository.create({
        userId: 'user-1',
        type: 'password_reset',
        tokenHash: 'hash:mismatch',
        expiresAt: future(),
      });

      await expect(repository.consume('hash:mismatch', 'email_verification')).resolves.toBeUndefined();
    });
  });
});
