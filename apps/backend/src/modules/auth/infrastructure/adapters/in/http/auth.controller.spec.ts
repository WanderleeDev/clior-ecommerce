import { AuthController } from './auth.controller';
import { buildRefreshCookieOptions, resolveAppOrigin } from './auth.controller';
import type { RegisterUserPort } from '../../../../application/ports/in/register-user.port';
import type { LoginUserPort } from '../../../../application/ports/in/login-user.port';
import type { GetCurrentUserPort } from '../../../../application/ports/in/get-current-user.port';
import type { LogoutPort } from '../../../../application/ports/in/auth-flow.ports';
import type { RefreshAuthPort } from '../../../../application/ports/in/auth-flow.ports';
import type { RequestPasswordResetPort } from '../../../../application/ports/in/auth-flow.ports';
import type { RequestVerificationPort } from '../../../../application/ports/in/auth-flow.ports';
import type { ResetPasswordPort } from '../../../../application/ports/in/auth-flow.ports';
import type { VerifyEmailPort } from '../../../../application/ports/in/auth-flow.ports';
import type { LoginDto } from './auth.dto';
import type { AuthUser } from '../../../../domain/models/auth-user';
import type { Request, Response } from 'express';

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL,
};

const user: AuthUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function restoreEnv(): void {
  if (originalEnv.NODE_ENV === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalEnv.NODE_ENV;
  if (originalEnv.APP_URL === undefined) delete process.env.APP_URL;
  else process.env.APP_URL = originalEnv.APP_URL;
}

function request(host: string, protocol = 'http'): Request {
  return { headers: { host }, protocol, cookies: {} } as unknown as Request;
}

function stubPort(): { execute: jest.Mock } {
  return { execute: jest.fn() };
}

function buildController(): {
  controller: AuthController;
  ports: { login: { execute: jest.Mock }; refresh: { execute: jest.Mock } };
} {
  const register = stubPort();
  const login = stubPort();
  const me = stubPort();
  const refresh = stubPort();
  const logout = stubPort();
  const verify = stubPort();
  const requestVerification = stubPort();
  const requestPasswordReset = stubPort();
  const resetPassword = stubPort();

  const controller = new AuthController(
    register as unknown as RegisterUserPort,
    login as unknown as LoginUserPort,
    me as unknown as GetCurrentUserPort,
    refresh as unknown as RefreshAuthPort,
    logout as unknown as LogoutPort,
    verify as unknown as VerifyEmailPort,
    requestVerification as unknown as RequestVerificationPort,
    requestPasswordReset as unknown as RequestPasswordResetPort,
    resetPassword as unknown as ResetPasswordPort,
  );

  return { controller, ports: { login, refresh } };
}

afterEach(() => {
  restoreEnv();
});

describe('refresh cookie policy (M14)', () => {
  it('keeps SameSite=Lax for a same-site deployment', () => {
    delete process.env.APP_URL; // defaults to http://localhost:4200
    process.env.NODE_ENV = 'test';

    const options = buildRefreshCookieOptions(request('localhost:3000'));

    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/api/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  });

  it('keeps SameSite=Lax for subdomains of the same registrable domain in production', () => {
    process.env.APP_URL = 'https://app.example.com';
    process.env.NODE_ENV = 'production';

    const options = buildRefreshCookieOptions(request('api.example.com', 'https'));

    expect(options).toMatchObject({ sameSite: 'lax', secure: true });
  });

  it('switches to SameSite=None + Secure for a cross-site production deployment', () => {
    process.env.APP_URL = 'https://frontend.example.net';
    process.env.NODE_ENV = 'production';

    const options = buildRefreshCookieOptions(request('api.example.com'));

    expect(options).toMatchObject({ sameSite: 'none', secure: true, httpOnly: true });
  });

  it('allows a cross-site non-production deployment that is served over HTTPS', () => {
    process.env.APP_URL = 'https://frontend.example.net';
    process.env.NODE_ENV = 'test';

    const options = buildRefreshCookieOptions(request('api.example.com', 'https'));

    expect(options).toMatchObject({ sameSite: 'none', secure: true });
  });

  it('rejects an insecure cross-site configuration instead of breaking silently', () => {
    process.env.APP_URL = 'https://frontend.example.net';
    process.env.NODE_ENV = 'test';

    expect(() => buildRefreshCookieOptions(request('localhost:3000'))).toThrow(/Cross-site/);
  });

  it('treats a scheme mismatch as cross-site (schemeful same-site)', () => {
    process.env.APP_URL = 'https://localhost:4200';
    process.env.NODE_ENV = 'test';

    expect(() => buildRefreshCookieOptions(request('localhost:3000', 'http'))).toThrow(/Cross-site/);
  });
});

describe('refresh cookie secure flag (L18)', () => {
  it('decides the secure flag at cookie-creation time, not at module load', () => {
    delete process.env.APP_URL;
    process.env.NODE_ENV = 'test';
    const before = buildRefreshCookieOptions(request('localhost:3000'));

    process.env.NODE_ENV = 'production';
    const after = buildRefreshCookieOptions(request('localhost:3000'));

    expect(before.secure).toBe(false);
    expect(after.secure).toBe(true);
  });

  it('validates NODE_ENV before trusting it (case and whitespace tolerant)', () => {
    delete process.env.APP_URL;
    process.env.NODE_ENV = '  Production ';

    expect(buildRefreshCookieOptions(request('localhost:3000')).secure).toBe(true);
  });

  it('treats non-production values as not secure-capable', () => {
    delete process.env.APP_URL;
    process.env.NODE_ENV = 'staging';

    expect(buildRefreshCookieOptions(request('localhost:3000')).secure).toBe(false);
  });
});

describe('resolveAppOrigin (CORS/cookie shared source)', () => {
  it('falls back to the documented default when APP_URL is unset', () => {
    delete process.env.APP_URL;
    expect(resolveAppOrigin()).toBe('http://localhost:4200');
  });

  it('normalizes APP_URL to a pure origin', () => {
    process.env.APP_URL = 'https://app.example.com/';
    expect(resolveAppOrigin()).toBe('https://app.example.com');
  });

  it('rejects an unparseable APP_URL', () => {
    process.env.APP_URL = 'not a url';
    expect(() => resolveAppOrigin()).toThrow(/APP_URL/);
  });

  it('rejects a non-http(s) APP_URL', () => {
    process.env.APP_URL = 'ftp://example.com';
    expect(() => resolveAppOrigin()).toThrow(/APP_URL/);
  });
});

describe('AuthController cookie wiring (M14)', () => {
  it('sets the login refresh cookie through the deployment policy', async () => {
    process.env.APP_URL = 'https://api.example.com';
    process.env.NODE_ENV = 'production';
    const { controller, ports } = buildController();
    ports.login.execute.mockResolvedValue({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    const response = { cookie: jest.fn() } as unknown as Response;

    const result = await controller.login(
      { email: user.email, password: 'secret-password' } as LoginDto,
      request('api.example.com', 'https'),
      response,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-1',
      expect.objectContaining({ sameSite: 'lax', secure: true, httpOnly: true }),
    );
    expect(result).toEqual({
      accessToken: 'access-1',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  });

  it('sets the refresh endpoint cookie through the deployment policy', async () => {
    delete process.env.APP_URL;
    process.env.NODE_ENV = 'test';
    const { controller, ports } = buildController();
    ports.refresh.execute.mockResolvedValue({ accessToken: 'access-2', refreshToken: 'refresh-2', user });
    const req = request('localhost:3000');
    req.cookies = { refresh_token: 'raw-1' };
    const response = { cookie: jest.fn() } as unknown as Response;

    await controller.refresh(req, response);

    expect(ports.refresh.execute).toHaveBeenCalledWith('raw-1');
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-2',
      expect.objectContaining({ sameSite: 'lax', secure: false }),
    );
  });
});
