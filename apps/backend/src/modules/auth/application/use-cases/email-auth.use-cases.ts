import { Injectable } from '@nestjs/common';
import { InvalidOneTimeTokenError } from '../../domain/errors/auth-flow.errors';
import {
  PASSWORD_RESET_REQUESTED_EVENT,
  VERIFICATION_REQUESTED_EVENT,
} from '../../domain/events/user-registered.event';
import type { AuthUser } from '../../domain/models/auth-user';
import { EventBusPort } from '../ports/out/event-bus.port';
import { AuthTokenRepositoryPort } from '../ports/out/auth-token-repository.port';
import { OpaqueTokenPort } from '../ports/out/opaque-token.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import {
  RequestPasswordResetPort,
  RequestVerificationPort,
  ResetPasswordPort,
  VerifyEmailPort,
} from '../ports/in/auth-flow.ports';
import { PasswordHasherPort } from '../ports/out/password-hasher.port';
import { RefreshSessionPort } from '../ports/out/refresh-session.port';
import type { AuthOneTimeTokenType } from '../types/auth.types';

const ONE_HOUR = 60 * 60 * 1000;

@Injectable()
export class VerifyEmailUseCase extends VerifyEmailPort {
  constructor(
    private readonly tokens: AuthTokenRepositoryPort,
    private readonly tokenGenerator: OpaqueTokenPort,
    private readonly users: UserRepositoryPort,
  ) {
    super();
  }

  async execute(token: string): Promise<void> {
    const result = await this.tokens.consume(this.tokenGenerator.hash(token), 'email_verification');
    if (!result) throw new InvalidOneTimeTokenError();
    await this.users.markEmailVerified(result.userId);
  }
}

@Injectable()
export class RequestVerificationUseCase extends RequestVerificationPort {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly events: EventBusPort,
  ) {
    super();
  }

  async execute(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (user && !user.emailVerifiedAt) this.events.publish(VERIFICATION_REQUESTED_EVENT, user);
  }
}

@Injectable()
export class RequestPasswordResetUseCase extends RequestPasswordResetPort {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly events: EventBusPort,
  ) {
    super();
  }

  async execute(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (user) this.events.publish(PASSWORD_RESET_REQUESTED_EVENT, user);
  }
}

@Injectable()
export class ResetPasswordUseCase extends ResetPasswordPort {
  constructor(
    private readonly tokens: AuthTokenRepositoryPort,
    private readonly tokenGenerator: OpaqueTokenPort,
    private readonly users: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly sessions: RefreshSessionPort,
  ) {
    super();
  }

  async execute(token: string, password: string): Promise<void> {
    const result = await this.tokens.consume(this.tokenGenerator.hash(token), 'password_reset');
    if (!result) throw new InvalidOneTimeTokenError();
    await this.users.updatePassword(result.userId, await this.passwordHasher.hash(password));
    await this.users.resetFailedLogins(result.userId);
    await this.sessions.revokeAllForUser(result.userId);
  }
}

export type EmailAuthUser = AuthUser;
export type EmailTokenType = AuthOneTimeTokenType;
