import {
  EmailAlreadyRegisteredError,
} from '../../domain/errors/email-already-registered.error';
import type { AuthUser, AuthUserWithPassword } from '../../domain/models/auth-user';
import type { EventBusPort } from '../ports/out/event-bus.port';
import type { PasswordHasherPort } from '../ports/out/password-hasher.port';
import type { UserRepositoryPort } from '../ports/out/user-repository.port';
import type { RefreshSessionPort } from '../ports/out/refresh-session.port';
import type { AuthTokenRepositoryPort } from '../ports/out/auth-token-repository.port';
import type { OpaqueTokenPort } from '../ports/out/opaque-token.port';
import { LoginUserUseCase } from './login-user.use-case';
import { RegisterUserUseCase } from './register-user.use-case';
import { ResetPasswordUseCase } from './email-auth.use-cases';

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

class FakeUserRepository implements UserRepositoryPort {
  private stored: AuthUserWithPassword | undefined;

  constructor(stored?: AuthUserWithPassword) {
    this.stored = stored;
  }

  async create(input: { email: string; name: string; password: string; passwordHash: string }): Promise<AuthUser> {
    this.stored = {
      ...user,
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    };
    return this.stored;
  }

  async findByEmail(email: string): Promise<AuthUserWithPassword | undefined> {
    return this.stored?.email === email ? this.stored : undefined;
  }

  async findById(id: string): Promise<AuthUser | undefined> {
    return this.stored && this.stored.id === id ? this.stored : undefined;
  }

  async markEmailVerified(): Promise<void> {}
  async updatePassword(): Promise<void> {}
  async recordFailedLogin(): Promise<void> {}
  async resetFailedLogins(): Promise<void> {}
}

class FakePasswordHasher implements PasswordHasherPort {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return hash === `hashed:${password}`;
  }
}

class FakeRefreshSession implements RefreshSessionPort {
  revokedUserIds: string[] = [];

  async create(userId: string) {
    return { accessToken: `token:${userId}`, refreshToken: `refresh:${userId}`, user };
  }

  async rotate() {
    return this.create(user.id);
  }

  async revoke(): Promise<void> {}
  async revokeAllForUser(userId: string): Promise<void> {
    this.revokedUserIds.push(userId);
  }
}

class FakeEventBus implements EventBusPort {
  readonly events: Array<{ name: string; payload: unknown }> = [];

  publish(name: string, payload: unknown): void {
    this.events.push({ name, payload });
  }
}

class FakeAuthTokenRepository implements AuthTokenRepositoryPort {
  async create(): Promise<void> {}

  async consume(): Promise<{ userId: string }> {
    return { userId: user.id };
  }
}

class FakeOpaqueToken implements OpaqueTokenPort {
  generate(): string {
    return 'generated-token';
  }

  hash(token: string): string {
    return `hash:${token}`;
  }
}

describe('Auth use cases', () => {
  it('registers a user with a hashed password and publishes an event', async () => {
    const users = new FakeUserRepository();
    const events = new FakeEventBus();
    const useCase = new RegisterUserUseCase(
      users,
      new FakePasswordHasher(),
      events,
      new FakeRefreshSession(),
    );

    const result = await useCase.execute({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'secret-password',
    });

    expect(result.accessToken).toBe('token:user-1');
    expect(result.user.email).toBe('maria@example.com');
    expect(events.events).toHaveLength(1);
    expect(await users.findByEmail('maria@example.com')).toMatchObject({
      passwordHash: 'hashed:secret-password',
    });
  });

  it('rejects duplicate emails before hashing or persistence', async () => {
    const users = new FakeUserRepository({ ...user, passwordHash: 'hashed:old', failedLoginAttempts: 0, lockedUntil: null });
    const useCase = new RegisterUserUseCase(
      users,
      new FakePasswordHasher(),
      new FakeEventBus(),
      new FakeRefreshSession(),
    );

    await expect(
      useCase.execute({ name: 'Other', email: user.email, password: 'secret-password' }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });

  it('returns a token only for valid credentials', async () => {
    const verifiedUser = { ...user, emailVerifiedAt: new Date('2026-01-02T00:00:00.000Z') };
    const useCase = new LoginUserUseCase(
      new FakeUserRepository({ ...verifiedUser, passwordHash: 'hashed:secret-password', failedLoginAttempts: 0, lockedUntil: null }),
      new FakePasswordHasher(),
      new FakeRefreshSession(),
    );

    await expect(
      useCase.execute({ email: user.email, password: 'secret-password' }),
    ).resolves.toMatchObject({ accessToken: 'token:user-1' });
  });

  it('rejects login until the email is verified', async () => {
    const useCase = new LoginUserUseCase(
      new FakeUserRepository({ ...user, passwordHash: 'hashed:secret-password', failedLoginAttempts: 0, lockedUntil: null }),
      new FakePasswordHasher(),
      new FakeRefreshSession(),
    );

    await expect(useCase.execute({ email: user.email, password: 'secret-password' })).rejects.toThrow(
      'Email address must be verified before login',
    );
  });

  it('revokes all refresh sessions after a password reset', async () => {
    const sessions = new FakeRefreshSession();
    const useCase = new ResetPasswordUseCase(
      new FakeAuthTokenRepository(),
      new FakeOpaqueToken(),
      new FakeUserRepository({ ...user, passwordHash: 'hashed:old', failedLoginAttempts: 2, lockedUntil: null }),
      new FakePasswordHasher(),
      sessions,
    );

    await useCase.execute('reset-token', 'New-password1!');

    expect(sessions.revokedUserIds).toEqual([user.id]);
  });
});
