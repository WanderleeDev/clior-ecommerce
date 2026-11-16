import { InvalidOneTimeTokenError } from '../../domain/errors/auth-flow.errors';
import { USER_REGISTERED_EVENT, VERIFICATION_REQUESTED_EVENT } from '../../domain/events/user-registered.event';
import type { AuthUser, AuthUserWithPassword } from '../../domain/models/auth-user';
import type { AuthTokenRepositoryPort } from '../ports/out/auth-token-repository.port';
import type { EventBusPort } from '../ports/out/event-bus.port';
import type { OpaqueTokenPort } from '../ports/out/opaque-token.port';
import type { UserRepositoryPort } from '../ports/out/user-repository.port';
import { RequestVerificationUseCase, VerifyEmailUseCase } from './email-auth.use-cases';

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  petType: null,
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

class FakeTokens implements AuthTokenRepositoryPort {
  readonly consumed: Array<{ tokenHash: string; type: string }> = [];
  readonly created: Array<{ userId: string; type: string }> = [];
  result: { userId: string } | undefined = { userId: user.id };

  async create(input: { userId: string; type: string }): Promise<void> {
    this.created.push({ userId: input.userId, type: input.type });
  }

  async consume(tokenHash: string, type: string): Promise<{ userId: string } | undefined> {
    this.consumed.push({ tokenHash, type });
    return this.result;
  }
}

class FakeUsers implements UserRepositoryPort {
  constructor(private readonly stored: AuthUser | null) {}
  readonly verified: string[] = [];

  async create(): Promise<AuthUser> {
    throw new Error('not used');
  }
  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    return this.stored && this.stored.email === email ? { ...this.stored, passwordHash: 'x', failedLoginAttempts: 0, lockedUntil: null } : null;
  }
  async findById(): Promise<AuthUser | null> {
    return this.stored;
  }
  async markEmailVerified(id: string): Promise<void> {
    this.verified.push(id);
  }
  async updatePassword(): Promise<void> {
    return Promise.resolve();
  }
  async recordFailedLogin(): Promise<void> {
    return Promise.resolve();
  }
  async resetFailedLogins(): Promise<void> {
    return Promise.resolve();
  }
}

class FakeEvents implements EventBusPort {
  readonly published: Array<{ eventName: string; payload: unknown }> = [];
  publish(eventName: string, payload: unknown): void {
    this.published.push({ eventName, payload });
  }
}

class FakeOpaqueTokens implements OpaqueTokenPort {
  generate(): string {
    return 'raw-token';
  }
  hash(token: string): string {
    return `hash:${token}`;
  }
}

describe('VerifyEmailUseCase', () => {
  it('consumes the email_verification token and marks the email verified', async () => {
    const tokens = new FakeTokens();
    const users = new FakeUsers(user);
    const useCase = new VerifyEmailUseCase(tokens, new FakeOpaqueTokens(), users);

    await useCase.execute('raw-token');

    expect(tokens.consumed).toEqual([
      { tokenHash: 'hash:raw-token', type: 'email_verification' },
    ]);
    expect(users.verified).toEqual([user.id]);
  });

  it('rejects an invalid, expired or already consumed token', async () => {
    const tokens = new FakeTokens();
    tokens.result = undefined;
    const users = new FakeUsers(user);
    const useCase = new VerifyEmailUseCase(tokens, new FakeOpaqueTokens(), users);

    await expect(useCase.execute('stale-token')).rejects.toBeInstanceOf(InvalidOneTimeTokenError);
    expect(users.verified).toEqual([]);
  });
});

describe('RequestVerificationUseCase', () => {
  it('requests a new verification email for an unverified account', async () => {
    const events = new FakeEvents();
    const useCase = new RequestVerificationUseCase(new FakeUsers(user), events);

    await useCase.execute(user.email);

    expect(events.published).toHaveLength(1);
    expect(events.published[0].eventName).toBe(VERIFICATION_REQUESTED_EVENT);
    expect(events.published[0].payload).toMatchObject(user);
  });

  it('does nothing for an already verified account', async () => {
    const events = new FakeEvents();
    const verified = { ...user, emailVerifiedAt: new Date('2026-01-02T00:00:00.000Z') };
    const useCase = new RequestVerificationUseCase(new FakeUsers(verified), events);

    await useCase.execute(verified.email);

    expect(events.published).toEqual([]);
  });

  it('does nothing for an unknown email, so the endpoint cannot enumerate accounts', async () => {
    const events = new FakeEvents();
    const useCase = new RequestVerificationUseCase(new FakeUsers(null), events);

    await useCase.execute('nobody@example.com');

    expect(events.published).toEqual([]);
  });

  it('shares the registration event name contract', () => {
    expect(USER_REGISTERED_EVENT).toBe('auth.user-registered');
  });
});
