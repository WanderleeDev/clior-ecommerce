import {
  EmailAlreadyRegisteredError,
} from '../../domain/errors/email-already-registered.error';
import type { AuthUser, AuthUserWithPassword } from '../../domain/models/auth-user';
import type { EventBusPort } from '../ports/out/event-bus.port';
import type { PasswordHasherPort } from '../ports/out/password-hasher.port';
import type { TokenServicePort } from '../ports/out/token-service.port';
import type { UserRepositoryPort } from '../ports/out/user-repository.port';
import { LoginUserUseCase } from './login-user.use-case';
import { RegisterUserUseCase } from './register-user.use-case';

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

class FakeUserRepository implements UserRepositoryPort {
  private stored: AuthUserWithPassword | undefined;

  constructor(stored?: AuthUserWithPassword) {
    this.stored = stored;
  }

  async create(input: { email: string; name: string; password: string; passwordHash: string }): Promise<AuthUser> {
    this.stored = { ...user, email: input.email, name: input.name, passwordHash: input.passwordHash };
    return this.stored;
  }

  async findByEmail(email: string): Promise<AuthUserWithPassword | undefined> {
    return this.stored?.email === email ? this.stored : undefined;
  }

  async findById(id: string): Promise<AuthUser | undefined> {
    return this.stored?.id === id ? this.stored : undefined;
  }
}

class FakePasswordHasher implements PasswordHasherPort {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return hash === `hashed:${password}`;
  }
}

class FakeTokenService implements TokenServicePort {
  async sign(payload: { sub: string; email: string }): Promise<string> {
    return `token:${payload.sub}`;
  }
}

class FakeEventBus implements EventBusPort {
  readonly events: Array<{ name: string; payload: unknown }> = [];

  publish(name: string, payload: unknown): void {
    this.events.push({ name, payload });
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
      new FakeTokenService(),
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
    const users = new FakeUserRepository({ ...user, passwordHash: 'hashed:old' });
    const useCase = new RegisterUserUseCase(
      users,
      new FakePasswordHasher(),
      new FakeEventBus(),
      new FakeTokenService(),
    );

    await expect(
      useCase.execute({ name: 'Other', email: user.email, password: 'secret-password' }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });

  it('returns a token only for valid credentials', async () => {
    const useCase = new LoginUserUseCase(
      new FakeUserRepository({ ...user, passwordHash: 'hashed:secret-password' }),
      new FakePasswordHasher(),
      new FakeTokenService(),
    );

    await expect(
      useCase.execute({ email: user.email, password: 'secret-password' }),
    ).resolves.toMatchObject({ accessToken: 'token:user-1' });
  });
});
