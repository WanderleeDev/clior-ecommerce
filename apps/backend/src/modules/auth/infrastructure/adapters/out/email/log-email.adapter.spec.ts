import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { LogEmailAdapter } from './log-email.adapter';

function config(values: Record<string, string>): ConfigService {
  return {
    get: (key: string) => values[key],
    getOrThrow: (key: string) => {
      const value = values[key];
      if (value === undefined) throw new Error(`missing ${key}`);
      return value;
    },
  } as unknown as ConfigService;
}

describe('LogEmailAdapter', () => {
  afterEach(() => jest.restoreAllMocks());

  it('logs the verification link instead of calling a provider', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    const adapter = new LogEmailAdapter(config({ APP_URL: 'http://localhost:4200' }));

    await adapter.sendVerification({ email: 'maria@example.com', name: 'Maria', token: 'raw token' });

    expect(log).toHaveBeenCalledTimes(1);
    expect(String(log.mock.calls[0][0])).toContain('http://localhost:4200/verificar?token=raw%20token');
    expect(String(log.mock.calls[0][0])).toContain('maria@example.com');
  });

  it('logs the password reset link', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    const adapter = new LogEmailAdapter(config({ APP_URL: 'http://localhost:4200' }));

    await adapter.sendPasswordReset({ email: 'maria@example.com', name: 'Maria', token: 'abc' });

    expect(String(log.mock.calls[0][0])).toContain('http://localhost:4200/restablecer?token=abc');
  });

  it('refuses to start in production so one-time links never reach production logs', () => {
    expect(
      () => new LogEmailAdapter(config({ APP_URL: 'https://clior.pe', NODE_ENV: ' production ' })),
    ).toThrow(/MAIL_TRANSPORT=log cannot be used with NODE_ENV=production/);
  });
});
