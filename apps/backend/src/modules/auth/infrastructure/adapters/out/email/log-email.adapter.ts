import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailSenderPort } from '../../../../application/ports/out/email-sender.port';
import { passwordResetUrl, verificationUrl } from './email-links';

/**
 * Development transport: writes the action link to the application log
 * instead of calling a provider.
 *
 * It exists so registration and password recovery can be exercised end to end
 * before a real Resend key and templates are provisioned. It refuses to start
 * in production because logging one-time tokens there would leak account
 * takeover links into log storage.
 */
@Injectable()
export class LogEmailAdapter extends EmailSenderPort {
  private readonly logger = new Logger(LogEmailAdapter.name);
  private readonly appUrl: string;

  constructor(config: ConfigService) {
    super();
    const environment = (config.get<string>('NODE_ENV') ?? '').trim().toLowerCase();
    if (environment === 'production') {
      throw new Error('MAIL_TRANSPORT=log cannot be used with NODE_ENV=production');
    }
    this.appUrl = config.getOrThrow<string>('APP_URL');
  }

  sendVerification(input: { email: string; name: string; token: string }): Promise<void> {
    this.logger.log(
      `[dev-mail] verification for ${input.email}: ${verificationUrl(this.appUrl, input.token)}`,
    );
    return Promise.resolve();
  }

  sendPasswordReset(input: { email: string; name: string; token: string }): Promise<void> {
    this.logger.log(
      `[dev-mail] password reset for ${input.email}: ${passwordResetUrl(this.appUrl, input.token)}`,
    );
    return Promise.resolve();
  }
}
