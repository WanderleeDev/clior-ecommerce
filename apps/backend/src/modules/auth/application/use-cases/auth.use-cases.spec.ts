import {
  EmailAlreadyRegisteredError,
} from '../../domain/errors/email-already-registered.error';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { AccountLockedError } from '../../domain/errors/auth-flow.errors';
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
import { GetCurrentUserUseCase } from './get-current-user.use-case';

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

const verifiedUser: AuthUserWithPassword = {
  ...user,
  emailVerifiedAt: new Date('2026-01-02T00:00:00.000Z'),
  passwordHash: 'hashed:secret-password',
  failedLoginAttempts: 0,
  lockedUntil: null,
};

const lockedUser: AuthUserWithPassword = {
  ...verifiedUser,
  failedLoginAttempts: 5,
  lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
};

class FakeUserRepository implements UserRepositoryPort {
  private stored: AuthUserWithPassword | null;
  readonly failedLoginCalls: Array<{ id: string; attempts: number; lockedUntil: Date | null }> = [];
  readonly resetFailedLoginsCalls: string[] = [];

  constructor(stored?: AuthUserWithPassword) {
    this.stored = stored ?? null;
  }

  peek(): AuthUserWithPassword | null {
    return this.stored;
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

  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    return this.stored?.email === email ? this.stored : null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    if (!this.stored || this.stored.id !== id) return null;
    // Mirrors the port contract: findById returns AuthUser, so credential and
    // lockout columns are projected away exactly as the real repository does.
    const {
      passwordHash: _passwordHash,
      failedLoginAttempts: _failedLoginAttempts,
      lockedUntil: _lockedUntil,
      ...publicUser
    } = this.stored;
    return publicUser;
  }

  async markEmailVerified(): Promise<void> {
    // No test in this suite exercises verification; the flow lives in email-auth.
  }

  async updatePassword(): Promise<void> {
    // Reset-password coverage lives in the email-auth suite, not here.
  }

  async recordFailedLogin(id: string, attempts: number, lockedUntil: Date | null): Promise<void> {
    this.failedLoginCalls.push({ id, attempts, lockedUntil });
    if (this.stored && this.stored.id === id) {
      this.stored.failedLoginAttempts = attempts;
      this.stored.lockedUntil = lockedUntil;
    }
  }

  async resetFailedLogins(id: string): Promise<void> {
    this.resetFailedLoginsCalls.push(id);
    if (this.stored && this.stored.id === id) {
      this.stored.failedLoginAttempts = 0;
      this.stored.lockedUntil = null;
    }
  }
}

class FakePasswordHasher implements PasswordHasherPort {
  readonly verifyCalls: Array<{ hash: string; password: string }> = [];

  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async verify(hash: string, password: string): Promise<boolean> {
    this.verifyCalls.push({ hash, password });
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

  async revoke(): Promise<void> {
    // Single-session revocation is asserted through revokeAllForUser below.
  }
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
  async create(): Promise<void> {
    // Token persistence is covered by the refresh/token suites.
  }

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

function loginAttempt(
  users: UserRepositoryPort,
  hasher: PasswordHasherPort,
  email: string,
  password: string,
) {
  return new LoginUserUseCase(users, hasher, new FakeRefreshSession()).execute({ email, password });
}

describe('Auth use cases', () => {
  it('registers a user with a hashed password and publishes an event', async () => {
    const users = new FakeUserRepository();
    const events = new FakeEventBus();
    const useCase = new RegisterUserUseCase(
      users,
      new FakePasswordHasher(),
      events,
    );

    const result = await useCase.execute({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'secret-password',
    });

    expect(result).toBeUndefined();
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
    );

    await expect(
      useCase.execute({ name: 'Other', email: user.email, password: 'secret-password' }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });

  it('returns a token only for valid credentials', async () => {
    const useCase = new LoginUserUseCase(
      new FakeUserRepository(verifiedUser),
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

describe('H3 — account lockout only impedes failed guesses', () => {
  it('verifies the password before reporting an active lock', async () => {
    const hasher = new FakePasswordHasher();
    const users = new FakeUserRepository(lockedUser);

    // A lock must not short-circuit verification: returning early is what let an
    // unauthenticated caller infer account state from the work the server did.
    await expect(
      loginAttempt(users, hasher, user.email, 'secret-password'),
    ).rejects.toBeInstanceOf(AccountLockedError);

    expect(hasher.verifyCalls).toHaveLength(1);
    expect(hasher.verifyCalls[0].hash).toBe('hashed:secret-password');
  });

  it('never extends an active lock with further wrong passwords', async () => {
    const users = new FakeUserRepository(lockedUser);

    await expect(
      loginAttempt(users, new FakePasswordHasher(), user.email, 'wrong-password'),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    // Without this an attacker could hold an account locked indefinitely by
    // sending a failing guess every few seconds.
    expect(users.failedLoginCalls).toHaveLength(0);
    expect(users.peek()).toMatchObject({
      failedLoginAttempts: 5,
      lockedUntil: lockedUser.lockedUntil,
    });
  });

  it('unlocks and clears the counter once the lock has expired', async () => {
    const users = new FakeUserRepository({
      ...lockedUser,
      lockedUntil: new Date(Date.now() - 1000),
    });

    await expect(
      loginAttempt(users, new FakePasswordHasher(), user.email, 'secret-password'),
    ).resolves.toMatchObject({ accessToken: 'token:user-1' });

    expect(users.resetFailedLoginsCalls).toEqual([user.id]);
    expect(users.peek()).toMatchObject({ failedLoginAttempts: 0, lockedUntil: null });
  });

  it('still locks after the failed-attempt threshold', async () => {
    const users = new FakeUserRepository({ ...verifiedUser, failedLoginAttempts: 4 });

    await expect(
      loginAttempt(users, new FakePasswordHasher(), user.email, 'wrong-password'),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(users.failedLoginCalls).toHaveLength(1);
    const call = users.failedLoginCalls[0];
    expect(call).toMatchObject({ id: user.id, attempts: 5 });
    expect(call.lockedUntil).toBeInstanceOf(Date);
    expect((call.lockedUntil as Date).getTime()).toBeGreaterThan(Date.now());
  });

  it('counts a fresh failed attempt below the threshold without locking', async () => {
    const users = new FakeUserRepository(verifiedUser);

    await expect(
      loginAttempt(users, new FakePasswordHasher(), user.email, 'wrong-password'),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(users.failedLoginCalls[0]).toMatchObject({ id: user.id, attempts: 1, lockedUntil: null });
  });

  it('treats an expired lock as a fresh counter instead of instantly re-locking', async () => {
    const users = new FakeUserRepository({
      ...verifiedUser,
      failedLoginAttempts: 5,
      lockedUntil: new Date(Date.now() - 1000),
    });

    await expect(
      loginAttempt(users, new FakePasswordHasher(), user.email, 'wrong-password'),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(users.failedLoginCalls).toHaveLength(1);
    expect(users.failedLoginCalls[0]).toMatchObject({ id: user.id, attempts: 1, lockedUntil: null });
  });
});

describe('M7 — login does not disclose whether an account exists', () => {
  it('runs password verification against a placeholder argon2 hash for unknown emails', async () => {
    const hasher = new FakePasswordHasher();
    const users = new FakeUserRepository();

    await expect(
      loginAttempt(users, hasher, 'ghost@example.com', 'whatever-password'),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(hasher.verifyCalls).toHaveLength(1);
    expect(hasher.verifyCalls[0].hash).toMatch(/^\$argon2id\$/);
    expect(hasher.verifyCalls[0].password).toBe('whatever-password');
  });

  it('answers wrong password and unknown email with the identical error', async () => {
    const wrongPassword = await loginAttempt(
      new FakeUserRepository(verifiedUser),
      new FakePasswordHasher(),
      user.email,
      'wrong-password',
    ).catch((error: unknown) => error);

    const unknownEmail = await loginAttempt(
      new FakeUserRepository(),
      new FakePasswordHasher(),
      'ghost@example.com',
      'wrong-password',
    ).catch((error: unknown) => error);

    expect(wrongPassword).toBeInstanceOf(InvalidCredentialsError);
    expect(unknownEmail).toBeInstanceOf(InvalidCredentialsError);
    expect((wrongPassword as Error).message).toBe((unknownEmail as Error).message);
  });

  it('does not disclose lock state to a failed password guess', async () => {
    const users = new FakeUserRepository(lockedUser);

    await expect(
      loginAttempt(users, new FakePasswordHasher(), user.email, 'wrong-password'),
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('M6 — current user is a public projection', () => {
  it('returns only public identity fields from the current user', async () => {
    const users = new FakeUserRepository({
      ...verifiedUser,
      failedLoginAttempts: 3,
      lockedUntil: new Date('2026-01-01T00:15:00.000Z'),
    });

    const result = await new GetCurrentUserUseCase(users).execute(user.id);

    expect(Object.keys(result).sort()).toEqual([
      'createdAt',
      'email',
      'emailVerifiedAt',
      'id',
      'name',
      'role',
    ]);
    expect(result).not.toHaveProperty('failedLoginAttempts');
    expect(result).not.toHaveProperty('lockedUntil');
    expect(result).not.toHaveProperty('passwordHash');
  });
});

describe('M13 — emails are normalized before lookup and persistence', () => {
  it('accepts a login regardless of email case or surrounding whitespace', async () => {
    const users = new FakeUserRepository(verifiedUser);

    await expect(
      loginAttempt(users, new FakePasswordHasher(), '  MARIA@EXAMPLE.COM ', 'secret-password'),
    ).resolves.toMatchObject({ accessToken: 'token:user-1' });
  });

  it('stores a normalized email on registration', async () => {
    const users = new FakeUserRepository();
    const useCase = new RegisterUserUseCase(users, new FakePasswordHasher(), new FakeEventBus());

    await useCase.execute({
      name: 'Maria',
      email: '  Maria@Example.COM ',
      password: 'secret-password',
    });

    expect(await users.findByEmail('maria@example.com')).not.toBeNull();
    expect(await users.findByEmail('  Maria@Example.COM ')).toBeNull();
  });
});
