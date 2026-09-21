import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PASSWORD_RESET_REQUESTED_EVENT,
  USER_REGISTERED_EVENT,
  VERIFICATION_REQUESTED_EVENT,
} from '../../../../domain/events/user-registered.event';
import type { UserRegisteredEvent } from '../../../../domain/events/user-registered.event';
import type { AuthUser } from '../../../../domain/models/auth-user';
import { AuthTokenRepositoryPort } from '../../../../application/ports/out/auth-token-repository.port';
import { EmailSenderPort } from '../../../../application/ports/out/email-sender.port';
import { OpaqueTokenPort } from '../../../../application/ports/out/opaque-token.port';

const TOKEN_TTL = 60 * 60 * 1000;

@Injectable()
export class AuthEmailListeners {
  private readonly logger = new Logger(AuthEmailListeners.name);

  constructor(
    private readonly tokens: AuthTokenRepositoryPort,
    private readonly tokenGenerator: OpaqueTokenPort,
    private readonly emailSender: EmailSenderPort,
  ) {}

  @OnEvent(USER_REGISTERED_EVENT)
  onUserRegistered(event: UserRegisteredEvent): Promise<void> {
    return this.sendVerification(event.user);
  }

  @OnEvent(VERIFICATION_REQUESTED_EVENT)
  onVerificationRequested(user: AuthUser): Promise<void> {
    return this.sendVerification(user);
  }

  @OnEvent(PASSWORD_RESET_REQUESTED_EVENT)
  async onPasswordResetRequested(user: AuthUser): Promise<void> {
    const token = this.tokenGenerator.generate();
    await this.tokens.create({ userId: user.id, type: 'password_reset', tokenHash: this.tokenGenerator.hash(token), expiresAt: new Date(Date.now() + TOKEN_TTL) });
    try {
      await this.emailSender.sendPasswordReset({ email: user.email, name: user.name, token });
    } catch (error) {
      this.logger.error('Password reset email delivery failed', error);
    }
  }

  private async sendVerification(user: AuthUser): Promise<void> {
    const token = this.tokenGenerator.generate();
    await this.tokens.create({ userId: user.id, type: 'email_verification', tokenHash: this.tokenGenerator.hash(token), expiresAt: new Date(Date.now() + TOKEN_TTL) });
    try {
      await this.emailSender.sendVerification({ email: user.email, name: user.name, token });
    } catch (error) {
      this.logger.error('Verification email delivery failed', error);
    }
  }
}
