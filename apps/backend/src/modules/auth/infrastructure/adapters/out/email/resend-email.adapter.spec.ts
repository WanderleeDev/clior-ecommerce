import type { ConfigService } from '@nestjs/config';
import { ResendEmailAdapter } from './resend-email.adapter';

const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

function configWith(values: Record<string, string>): ConfigService {
  return {
    getOrThrow(key: string): string {
      if (!(key in values)) {
        throw new Error(`Missing required environment variable "${key}"`);
      }
      return values[key];
    },
  } as unknown as ConfigService;
}

function completeConfig(): Record<string, string> {
  return {
    RESEND_API_KEY: 're_test_key',
    RESEND_VERIFICATION_TEMPLATE_ID: 'verification-template',
    RESEND_PASSWORD_RESET_TEMPLATE_ID: 'password-reset-template',
    MAIL_FROM: 'Clior <noreply@example.com>',
    APP_URL: 'http://localhost:4200',
  };
}

describe('ResendEmailAdapter', () => {
  beforeEach(() => {
    mockSend.mockReset().mockResolvedValue({ error: null });
  });

  it('fails fast at construction when RESEND_API_KEY is absent', () => {
    const { RESEND_API_KEY: _omitted, ...withoutKey } = completeConfig();

    expect(() => new ResendEmailAdapter(configWith(withoutKey))).toThrow(/RESEND_API_KEY/);
  });

  it('sends a verification email with the template and action url', async () => {
    const adapter = new ResendEmailAdapter(configWith(completeConfig()));

    await adapter.sendVerification({
      email: 'maria@example.com',
      name: 'Maria',
      token: 'raw-token',
    });

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Clior <noreply@example.com>',
      to: 'maria@example.com',
      template: {
        id: 'verification-template',
        variables: {
          USER_NAME: 'Maria',
          ACTION_URL: 'http://localhost:4200/verify-email?token=raw-token',
        },
      },
    });
  });

  it('propagates delivery errors so the caller can observe them', async () => {
    mockSend.mockResolvedValueOnce({ error: { message: 'rate limited' } });
    const adapter = new ResendEmailAdapter(configWith(completeConfig()));

    await expect(
      adapter.sendPasswordReset({
        email: 'maria@example.com',
        name: 'Maria',
        token: 'raw-token',
      }),
    ).rejects.toThrow('Email delivery failed: rate limited');
  });
});
