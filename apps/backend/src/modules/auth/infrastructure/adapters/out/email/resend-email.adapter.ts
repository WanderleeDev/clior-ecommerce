import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailSenderPort } from '../../../../application/ports/out/email-sender.port';

@Injectable()
export class ResendEmailAdapter extends EmailSenderPort {
  private readonly resend: Resend | undefined;
  private readonly from: string;
  private readonly appUrl: string;
  private readonly verificationTemplateId: string;
  private readonly passwordResetTemplateId: string;

  constructor(config: ConfigService) {
    super();
    const apiKey = config.getOrThrow<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : undefined;
    this.from = config.getOrThrow<string>('MAIL_FROM');
    this.appUrl = config.getOrThrow<string>('APP_URL');
    this.verificationTemplateId = config.getOrThrow<string>('RESEND_VERIFICATION_TEMPLATE_ID');
    this.passwordResetTemplateId = config.getOrThrow<string>('RESEND_PASSWORD_RESET_TEMPLATE_ID');
  }

  async sendVerification(input: { email: string; name: string; token: string }): Promise<void> {
    await this.send({
      to: input.email,
      templateId: this.verificationTemplateId,
      variables: {
        USER_NAME: input.name,
        ACTION_URL: `${this.appUrl}/verify-email?token=${input.token}`,
      },
    });
  }

  async sendPasswordReset(input: { email: string; name: string; token: string }): Promise<void> {
    await this.send({
      to: input.email,
      templateId: this.passwordResetTemplateId,
      variables: {
        USER_NAME: input.name,
        ACTION_URL: `${this.appUrl}/reset-password?token=${input.token}`,
      },
    });
  }

  private async send(input: {
    to: string;
    templateId: string;
    variables: Record<string, string>;
  }): Promise<void> {
    if (!this.resend) throw new Error('RESEND_API_KEY is not configured');
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: input.to,
      template: {
        id: input.templateId,
        variables: input.variables,
      },
    });
    if (error) throw new Error(`Email delivery failed: ${error.message}`);
  }
}
