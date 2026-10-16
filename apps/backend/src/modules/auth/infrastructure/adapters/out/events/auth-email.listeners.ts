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
import type { AuthOneTimeTokenType } from '../../../../application/types/auth.types';

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
  onPasswordResetRequested(user: AuthUser): Promise<void> {
    return this.sendPasswordReset(user);
  }

  private sendVerification(user: AuthUser): Promise<void> {
    return this.deliverOneTimeToken(user, 'email_verification', 'Verification', (token) =>
      this.emailSender.sendVerification({ email: user.email, name: user.name, token }),
    );
  }

  private sendPasswordReset(user: AuthUser): Promise<void> {
    return this.deliverOneTimeToken(user, 'password_reset', 'Password reset', (token) =>
      this.emailSender.sendPasswordReset({ email: user.email, name: user.name, token }),
    );
  }

  /**
   * One-time email pipeline.
   *
   * H4: every awaited call lives inside a try/catch and all failures are logged
   * and swallowed, so these handlers never reject. The event bus dispatches
   * fire-and-forget (see EventBusPort.publish), so a rejected handler promise
   * would surface as an unhandled rejection and could kill the process.
   *
   * M10 ordering: deliver the email first, persist the token second.
   * AuthTokenRepositoryPort only exposes `create` (no revoke/delete), so
   * persist-then-send would leave a live token that was never delivered and
   * cannot be invalidated. Sending first keeps the invariant "every persisted
   * one-time token was successfully delivered": a delivery failure returns
   * before `create` (no orphan token in the database), and a persistence
   * failure after a successful send leaves a delivered-but-dead token, which
   * fails closed (the user simply retries) and is logged as an error so the
   * failure stays observable instead of hidden behind publish-and-forget.
   */
  private async deliverOneTimeToken(
    user: AuthUser,
    type: AuthOneTimeTokenType,
    flow: string,
    deliver: (token: string) => Promise<void>,
  ): Promise<void> {
    // Last-resort containment: whatever happens inside (including unexpected
    // synchronous failures while building the payload), the handler promise
    // must resolve — the event bus dispatches without awaiting it (H4).
    try {
      const prepared = this.prepareToken(flow, user.id);
      if (!prepared) return;

      try {
        await deliver(prepared.token);
      } catch (error) {
        this.logger.error(
          `${flow} email delivery failed for user ${user.id}; no token was persisted`,
          error,
        );
        return;
      }

      try {
        await this.tokens.create({
          userId: user.id,
          type,
          tokenHash: prepared.tokenHash,
          expiresAt: new Date(Date.now() + TOKEN_TTL),
        });
      } catch (error) {
        this.logger.error(
          `${flow} email delivered for user ${user.id} but the token could not be persisted; the delivered token is unusable`,
          error,
        );
      }
    } catch (error) {
      this.logger.error(`${flow} email pipeline failed unexpectedly`, error);
    }
  }

  private prepareToken(flow: string, userId: string): { token: string; tokenHash: string } | undefined {
    try {
      const token = this.tokenGenerator.generate();
      return { token, tokenHash: this.tokenGenerator.hash(token) };
    } catch (error) {
      this.logger.error(`${flow} token generation failed for user ${userId}`, error);
      return undefined;
    }
  }
}
