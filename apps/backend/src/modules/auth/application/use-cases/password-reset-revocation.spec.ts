jest.mock('src/generated/prisma/client', () => ({ PrismaClient: class PrismaClient {} }), { virtual: true });

import { RequestPasswordResetUseCase } from './email-auth.use-cases';
import { PrismaAuthTokenRepository } from '../../infrastructure/adapters/out/persistence/prisma-auth-token.repository';
import type { PrismaService } from '../../../../prisma/prisma.service';
import type { AuthTokenRepositoryPort } from '../ports/out/auth-token-repository.port';
import type { EventBusPort } from '../ports/out/event-bus.port';
import type { UserRepositoryPort } from '../ports/out/user-repository.port';
import type { AuthOneTimeTokenType } from '../types/auth.types';
import type { AuthUser } from '../../domain/models/auth-user';
import { PASSWORD_RESET_REQUESTED_EVENT } from '../../domain/events/user-registered.event';

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

class FakeUserRepository {
  constructor(private readonly stored: AuthUser | null) {}
  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.stored && this.stored.email === email ? this.stored : null;
  }
}

class RecordingTokenRepository implements AuthTokenRepositoryPort {
  readonly revocations: Array<{ userId: string; type: AuthOneTimeTokenType }> = [];

  constructor(private readonly order?: string[]) {}

  async create(): Promise<void> {}
  async consume(): Promise<{ userId: string } | undefined> {
    return undefined;
  }

  revokeByUserAndType = jest.fn(async (userId: string, type: AuthOneTimeTokenType): Promise<void> => {
    this.order?.push('revoke');
    this.revocations.push({ userId, type });
  });
}

function buildOrderTracking() {
  const order: string[] = [];
  const tokens = new RecordingTokenRepository(order);
  const events = {
    publish: jest.fn((name: string) => {
      order.push(`publish:${name}`);
    }),
  } as unknown as EventBusPort;
  return { order, tokens, events };
}

describe('RequestPasswordResetUseCase (M9)', () => {
  it('revokes outstanding reset tokens before issuing a new one', async () => {
    const { order, tokens, events } = buildOrderTracking();
    const useCase = new RequestPasswordResetUseCase(
      new FakeUserRepository(user) as unknown as UserRepositoryPort,
      events,
      tokens,
    );

    await useCase.execute(user.email);

    expect(tokens.revokeByUserAndType).toHaveBeenCalledWith(user.id, 'password_reset');
    expect(order).toEqual(['revoke', `publish:${PASSWORD_RESET_REQUESTED_EVENT}`]);
  });

  it('does nothing for an unknown email (no revocation, no event)', async () => {
    const { tokens, events } = buildOrderTracking();
    const useCase = new RequestPasswordResetUseCase(
      new FakeUserRepository(user) as unknown as UserRepositoryPort,
      events,
      tokens,
    );

    await useCase.execute('ghost@example.com');

    expect(tokens.revokeByUserAndType).not.toHaveBeenCalled();
    expect(events.publish).not.toHaveBeenCalled();
  });
});

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

describe('PrismaAuthTokenRepository.revokeByUserAndType (M9)', () => {
  it('marks only outstanding tokens of that user and type as no longer redeemable', async () => {
    const fake = new FakeTokenPrisma();
    const repository = new PrismaAuthTokenRepository(fake as unknown as PrismaService);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await repository.create({ userId: 'user-1', type: 'password_reset', tokenHash: 'h:outstanding', expiresAt });
    await repository.create({ userId: 'user-1', type: 'password_reset', tokenHash: 'h:already-used', expiresAt });
    await repository.create({ userId: 'user-1', type: 'email_verification', tokenHash: 'h:verification', expiresAt });
    await repository.create({ userId: 'user-2', type: 'password_reset', tokenHash: 'h:other-user', expiresAt });
    await repository.consume('h:already-used', 'password_reset');

    await repository.revokeByUserAndType('user-1', 'password_reset');

    const byHash = (hash: string) => fake.tokens.find((row) => row.tokenHash === hash)!;
    expect(byHash('h:outstanding').consumedAt).not.toBeNull();
    expect(byHash('h:verification').consumedAt).toBeNull();
    expect(byHash('h:other-user').consumedAt).toBeNull();

    // The revoked token can no longer be redeemed.
    await expect(repository.consume('h:outstanding', 'password_reset')).resolves.toBeUndefined();
    // Tokens outside the revocation scope still work.
    await expect(repository.consume('h:other-user', 'password_reset')).resolves.toEqual({ userId: 'user-2' });
  });
});
