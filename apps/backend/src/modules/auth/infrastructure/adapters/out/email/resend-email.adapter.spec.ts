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
    SUPPORT_EMAIL: 'support@example.com',
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

  it('fails fast at construction when SUPPORT_EMAIL is absent', () => {
    const { SUPPORT_EMAIL: _omitted, ...withoutSupport } = completeConfig();

    expect(() => new ResendEmailAdapter(configWith(withoutSupport))).toThrow(/SUPPORT_EMAIL/);
  });

  it('sends a verification email with the published template variables', async () => {
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
          first_name: 'Maria',
          verification_link: 'http://localhost:4200/verificar?token=raw-token',
          expiration_time: '1 hora',
          support_email: 'support@example.com',
          website_url: 'http://localhost:4200',
        },
      },
    });
  });

  it('derives first_name from the first word of the registered name', async () => {
    const adapter = new ResendEmailAdapter(configWith(completeConfig()));

    await adapter.sendVerification({
      email: 'maria@example.com',
      name: '  Maria   Torres ',
      token: 'raw-token',
    });

    expect(mockSend.mock.calls[0][0].template.variables.first_name).toBe('Maria');
  });

  it('sends a password reset email with subject and the published template variables', async () => {
    const adapter = new ResendEmailAdapter(configWith(completeConfig()));

    await adapter.sendPasswordReset({
      email: 'maria@example.com',
      name: 'Maria',
      token: 'raw-token',
    });

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Clior <noreply@example.com>',
      to: 'maria@example.com',
      subject: 'Restablece tu contraseña',
      template: {
        id: 'password-reset-template',
        variables: {
          first_name: 'Maria',
          reset_link: 'http://localhost:4200/restablecer?token=raw-token',
          expiration_time: '1 hora',
          support_email: 'support@example.com',
          website_url: 'http://localhost:4200',
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