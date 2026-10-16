import { AuthEmailListeners } from './auth-email.listeners';
import { UserRegisteredEvent } from '../../../../domain/events/user-registered.event';
import type { AuthUser } from '../../../../domain/models/auth-user';
import type { AuthTokenRepositoryPort } from '../../../../application/ports/out/auth-token-repository.port';
import type { EmailSenderPort } from '../../../../application/ports/out/email-sender.port';
import type { OpaqueTokenPort } from '../../../../application/ports/out/opaque-token.port';

// @nestjs/event-emitter ships untranspiled ESM and jest.config.js may not be
// touched, so the decorator is stubbed: the handler logic under test does not
// depend on Nest wiring.
jest.mock('@nestjs/event-emitter', () => ({
  OnEvent: () => () => undefined,
}));

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

type Call = 'generate' | 'send:verification' | 'send:password-reset' | 'create';

class FakeTokenRepository implements AuthTokenRepositoryPort {
  failNext = false;

  constructor(private readonly calls: Call[]) {}

  async create(): Promise<void> {
    this.calls.push('create');
    if (this.failNext) {
      this.failNext = false;
      throw new Error('database unavailable');
    }
  }

  async consume(): Promise<undefined> {
    return undefined;
  }
}

class FakeOpaqueToken implements OpaqueTokenPort {
  failOnGenerate = false;

  constructor(private readonly calls: Call[]) {}

  generate(): string {
    this.calls.push('generate');
    if (this.failOnGenerate) {
      throw new Error('rng failure');
    }
    return 'raw-token';
  }

  hash(token: string): string {
    return `hash:${token}`;
  }
}

class FakeEmailSender implements EmailSenderPort {
  failNext = false;

  constructor(private readonly calls: Call[]) {}

  async sendVerification(): Promise<void> {
    this.calls.push('send:verification');
    if (this.failNext) {
      this.failNext = false;
      throw new Error('smtp failure');
    }
  }

  async sendPasswordReset(): Promise<void> {
    this.calls.push('send:password-reset');
    if (this.failNext) {
      this.failNext = false;
      throw new Error('smtp failure');
    }
  }
}

describe('AuthEmailListeners', () => {
  let calls: Call[];
  let tokens: FakeTokenRepository;
  let tokenGenerator: FakeOpaqueToken;
  let emailSender: FakeEmailSender;
  let listeners: AuthEmailListeners;
  let loggerError: jest.SpyInstance;

  beforeEach(() => {
    calls = [];
    tokens = new FakeTokenRepository(calls);
    tokenGenerator = new FakeOpaqueToken(calls);
    emailSender = new FakeEmailSender(calls);
    listeners = new AuthEmailListeners(tokens, tokenGenerator, emailSender);
    loggerError = jest
      .spyOn(
        (listeners as unknown as { logger: { error: (...args: unknown[]) => void } }).logger,
        'error',
      )
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerError.mockRestore();
  });

  describe('H4: handlers never reject (every awaited call is contained)', () => {
    it.each([
      ['onUserRegistered', () => listeners.onUserRegistered(new UserRegisteredEvent(user))],
      ['onVerificationRequested', () => listeners.onVerificationRequested(user)],
      ['onPasswordResetRequested', () => listeners.onPasswordResetRequested(user)],
    ])(
      '%s resolves and logs when token persistence fails',
      async (_name, run) => {
        tokens.failNext = true;

        await expect(run()).resolves.toBeUndefined();

        expect(loggerError).toHaveBeenCalled();
      },
    );

    it('resolves and logs when token generation fails', async () => {
      tokenGenerator.failOnGenerate = true;

      await expect(
        listeners.onUserRegistered(new UserRegisteredEvent(user)),
      ).resolves.toBeUndefined();

      expect(loggerError).toHaveBeenCalled();
    });

    it('resolves and logs when email delivery fails', async () => {
      emailSender.failNext = true;

      await expect(listeners.onPasswordResetRequested(user)).resolves.toBeUndefined();

      expect(loggerError).toHaveBeenCalled();
    });
  });

  describe('M10: one-time token ordering and failure observability', () => {
    it.each([
      [
        'verification',
        () => listeners.onUserRegistered(new UserRegisteredEvent(user)),
        'send:verification',
      ],
      ['password reset', () => listeners.onPasswordResetRequested(user), 'send:password-reset'],
    ])(
      'persists the %s token only after the email is accepted for delivery',
      async (_name, run, sendCall) => {
        await run();

        expect(calls).toEqual(['generate', sendCall, 'create']);
      },
    );

    it('leaves no live token behind when delivery fails', async () => {
      emailSender.failNext = true;

      await expect(listeners.onPasswordResetRequested(user)).resolves.toBeUndefined();

      expect(calls).not.toContain('create');
      expect(loggerError).toHaveBeenCalled();
    });

    it('logs an error when delivery succeeds but persistence fails', async () => {
      tokens.failNext = true;

      await expect(listeners.onVerificationRequested(user)).resolves.toBeUndefined();

      expect(calls).toContain('send:verification');
      expect(loggerError).toHaveBeenCalledWith(
        expect.stringMatching(/could not be persisted/i),
        expect.anything(),
      );
    });
  });
});
