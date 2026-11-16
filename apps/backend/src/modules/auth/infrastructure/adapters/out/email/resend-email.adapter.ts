import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailSenderPort } from '../../../../application/ports/out/email-sender.port';
import { passwordResetUrl, verificationUrl } from './email-links';

// Keep in sync with TOKEN_TTL in auth-email.listeners.ts.
const EXPIRATION_TIME = '1 hora';

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0];
}

@Injectable()
export class ResendEmailAdapter extends EmailSenderPort {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly appUrl: string;
  private readonly supportEmail: string;
  private readonly verificationTemplateId: string;
  private readonly passwordResetTemplateId: string;

  constructor(config: ConfigService) {
    super();
    // RESEND_API_KEY is required, matching config/env.validation.ts (M12):
    // password reset and email verification cannot work without delivery, so
    // the adapter fails fast at construction instead of degrading into a
    // silently broken auth flow. The zod schema reports the missing key at
    // boot, before dependency injection reaches this constructor.
    const apiKey = config.getOrThrow<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.from = config.getOrThrow<string>('MAIL_FROM');
    this.appUrl = config.getOrThrow<string>('APP_URL');
    this.supportEmail = config.getOrThrow<string>('SUPPORT_EMAIL');
    this.verificationTemplateId = config.getOrThrow<string>('RESEND_VERIFICATION_TEMPLATE_ID');
    this.passwordResetTemplateId = config.getOrThrow<string>('RESEND_PASSWORD_RESET_TEMPLATE_ID');
  }

  async sendVerification(input: { email: string; name: string; token: string }): Promise<void> {
    await this.send({
      to: input.email,
      templateId: this.verificationTemplateId,
      variables: {
        first_name: firstName(input.name),
        verification_link: verificationUrl(this.appUrl, input.token),
        expiration_time: EXPIRATION_TIME,
        support_email: this.supportEmail,
        website_url: this.appUrl,
      },
    });
  }

  async sendPasswordReset(input: { email: string; name: string; token: string }): Promise<void> {
    await this.send({
      to: input.email,
      // The published reset template has no default subject; Resend requires one.
      subject: 'Restablece tu contraseña',
      templateId: this.passwordResetTemplateId,
      variables: {
        first_name: firstName(input.name),
        reset_link: passwordResetUrl(this.appUrl, input.token),
        expiration_time: EXPIRATION_TIME,
        support_email: this.supportEmail,
        website_url: this.appUrl,
      },
    });
  }

  private async send(input: {
    to: string;
    subject?: string;
    templateId: string;
    variables: Record<string, string>;
  }): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: input.to,
      ...(input.subject ? { subject: input.subject } : {}),
      template: {
        id: input.templateId,
        variables: input.variables,
      },
    });
    if (error) throw new Error(`Email delivery failed: ${error.message}`);
  }
}