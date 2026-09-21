import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailSenderPort } from '../../../../application/ports/out/email-sender.port';

@Injectable()
export class ResendEmailAdapter extends EmailSenderPort {
  private readonly resend: Resend | undefined;
  private readonly from: string;
  private readonly appUrl: string;

  constructor(config: ConfigService) {
    super();
    const apiKey = config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : undefined;
    this.from = config.getOrThrow<string>('MAIL_FROM');
    this.appUrl = config.getOrThrow<string>('APP_URL');
  }

  async sendVerification(input: { email: string; name: string; token: string }): Promise<void> {
    await this.send({
      to: input.email,
      subject: 'Verify your Clio account',
      html: `<p>Hello ${input.name},</p><p>Verify your email by opening <a href="${this.appUrl}/verify-email?token=${input.token}">this link</a>.</p>`,
    });
  }

  async sendPasswordReset(input: { email: string; name: string; token: string }): Promise<void> {
    await this.send({
      to: input.email,
      subject: 'Reset your Clio password',
      html: `<p>Hello ${input.name},</p><p>Reset your password by opening <a href="${this.appUrl}/reset-password?token=${input.token}">this link</a>.</p>`,
    });
  }

  private async send(input: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.resend) throw new Error('RESEND_API_KEY is not configured');
    const { error } = await this.resend.emails.send({ from: this.from, ...input });
    if (error) throw new Error(`Email delivery failed: ${error.message}`);
  }
}
