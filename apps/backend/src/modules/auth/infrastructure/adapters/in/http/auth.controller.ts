import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isIP } from 'node:net';
import { GetCurrentUserPort } from '../../../../application/ports/in/get-current-user.port';
import { LoginUserPort } from '../../../../application/ports/in/login-user.port';
import { RegisterUserPort } from '../../../../application/ports/in/register-user.port';
import { Public } from '../../../../../../shared/infrastructure/http/public.decorator';
import { EmailDto, LoginDto, RegisterDto, ResetPasswordDto, TokenDto } from './auth.dto';
import {
  LogoutPort,
  RefreshAuthPort,
  RequestPasswordResetPort,
  RequestVerificationPort,
  ResetPasswordPort,
  VerifyEmailPort,
} from '../../../../application/ports/in/auth-flow.ports';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import type { AuthResult } from '../../../../application/types/auth.types';
import type { AuthUser } from '../../../../domain/models/auth-user';
import { InvalidRefreshTokenError } from '../../../../domain/errors/auth-flow.errors';

type PublicUser = Pick<AuthUser, 'id' | 'email' | 'name' | 'role'>;

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_PATH = '/api/auth';
// Mirrors the APP_URL default in config/env.validation.ts (owned elsewhere).
const DEFAULT_APP_URL = 'http://localhost:4200';

/**
 * Single source of truth for the frontend origin, shared by CORS (main.ts)
 * and the refresh-cookie policy below, so both decisions derive from the
 * same validated APP_URL (M14).
 */
export function resolveAppOrigin(): string {
  const raw = process.env.APP_URL?.trim() || DEFAULT_APP_URL;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`APP_URL must be an absolute http(s) URL, got "${raw}"`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`APP_URL must use http or https, got "${raw}"`);
  }
  return url.origin;
}

/**
 * L18: the secure flag is decided per cookie from validated state. Only an
 * exact `production` value (trimmed, case-insensitive) is secure-capable;
 * every other value — staging, test, typos — is treated as non-production.
 */
function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV?.trim().toLowerCase() === 'production';
}

/**
 * Registrable-domain heuristic (last two labels) used to compare sites.
 * No Public Suffix List is available offline, so multi-part public suffixes
 * such as co.uk collapse to the suffix itself; that errs toward "same-site",
 * which preserves current behavior for subdomain deployments.
 */
function registrableSite(hostname: string): string {
  const host = hostname.toLowerCase();
  const unwrapped = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
  if (isIP(unwrapped)) return unwrapped;
  if (!host.includes('.')) return host; // localhost or single-label intranet host
  const labels = host.split('.');
  return labels.slice(-2).join('.');
}

/** Schemeful same-site comparison: scheme + registrable domain must match. */
function isSameSite(appOrigin: string, apiOrigin: string): boolean {
  let app: URL;
  let api: URL;
  try {
    app = new URL(appOrigin);
    api = new URL(apiOrigin);
  } catch {
    return false;
  }
  return app.protocol === api.protocol && registrableSite(app.hostname) === registrableSite(api.hostname);
}

/**
 * Refresh-cookie policy (M14 + L18), evaluated per request so it reflects
 * the current environment and deployment:
 *
 * - same-site frontend/API (subdomains of one registrable domain, localhost):
 *   SameSite=Lax, which browsers send on the cross-origin POST.
 * - cross-site frontend/API: SameSite=Lax would never be sent on the POST,
 *   so the cookie becomes SameSite=None + Secure. That requires a secure
 *   context; an insecure cross-site setup is rejected loudly instead of
 *   failing silently (401 on every refresh).
 */
export function buildRefreshCookieOptions(request: Request): CookieOptions {
  const appOrigin = resolveAppOrigin();
  const apiOrigin = `${request.protocol}://${request.headers.host ?? ''}`;
  const crossSite = !isSameSite(appOrigin, apiOrigin);
  const production = isProductionEnvironment();

  if (crossSite && !production && request.protocol !== 'https') {
    throw new Error(
      `Cross-site refresh cookie cannot be issued: APP_URL (${appOrigin}) is not same-site with the API origin (${apiOrigin}). ` +
        'SameSite=None requires a secure context — deploy behind HTTPS (NODE_ENV=production) or align APP_URL with the API registrable domain.',
    );
  }

  return {
    httpOnly: true,
    secure: crossSite || production,
    sameSite: crossSite ? 'none' : 'lax',
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: REFRESH_COOKIE_PATH,
  };
}

type IssuedAuthResult = Pick<AuthResult, 'accessToken' | 'refreshToken' | 'user'>;
type PublicAuthResult = Pick<IssuedAuthResult, 'accessToken'> & { user: PublicUser };

function readRefreshToken(request: Request): string {
  const token = request.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw new InvalidRefreshTokenError();
  return token;
}

function toPublicUser(user: AuthUser): PublicUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function setRefreshCookie(response: Response, result: IssuedAuthResult, options: CookieOptions): PublicAuthResult {
  response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, options);
  return { accessToken: result.accessToken, user: toPublicUser(result.user) };
}

type AuthenticatedRequest = Request & {
  user: { id: string; email: string; name: string; createdAt: Date };
};

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserPort,
    private readonly loginUser: LoginUserPort,
    private readonly getCurrentUser: GetCurrentUserPort,
    private readonly refreshAuth: RefreshAuthPort,
    private readonly logoutUser: LogoutPort,
    private readonly verifyEmail: VerifyEmailPort,
    private readonly requestVerification: RequestVerificationPort,
    private readonly requestPasswordReset: RequestPasswordResetPort,
    private readonly resetPassword: ResetPasswordPort,
  ) {}

  @Post('register')
  @Public()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered, verification email sent' })
  @ApiResponse({ status: 409, description: 'Email is already registered' })
  async register(@Body() dto: RegisterDto) {
    await this.registerUser.execute(dto);
    return { message: 'Cuenta creada. Te enviamos un correo de verificación, revisa tu bandeja.' };
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Authenticated user and tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or locked account' })
  @ApiResponse({ status: 403, description: 'Email address is not verified' })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Resolve the cookie policy before issuing tokens so a misconfigured
    // deployment fails fast instead of leaving an orphaned session.
    const options = buildRefreshCookieOptions(request);
    return setRefreshCookie(response, await this.loginUser.execute(dto), options);
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  @ApiCookieAuth(REFRESH_COOKIE_NAME)
  @ApiOperation({ summary: 'Rotate a refresh token' })
  @ApiResponse({ status: 200, description: 'Rotated tokens' })
  @ApiResponse({ status: 401, description: 'Invalid, expired, or reused refresh token' })
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const options = buildRefreshCookieOptions(request);
    const refreshToken = readRefreshToken(request);
    return setRefreshCookie(response, await this.refreshAuth.execute(refreshToken), options);
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  @ApiCookieAuth(REFRESH_COOKIE_NAME)
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiResponse({ status: 200, description: 'Session revoked' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.logoutUser.execute(readRefreshToken(request));
    response.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  }

  @Post('verify-email')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify an email address' })
  @ApiBody({ type: TokenDto })
  @ApiResponse({ status: 200, description: 'Email verified' })
  async verify(@Body() dto: TokenDto): Promise<void> {
    await this.verifyEmail.execute(dto.token);
  }

  @Post('resend-verification')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request another verification email' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({ status: 200, description: 'Verification email requested' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async resendVerification(@Body() dto: EmailDto): Promise<void> {
    await this.requestVerification.execute(dto.email);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({ status: 200, description: 'Password reset email requested' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async forgotPassword(@Body() dto: EmailDto): Promise<void> {
    await this.requestPasswordReset.execute(dto.email);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset a password with a one-time token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset' })
  async reset(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.resetPassword.execute(dto.token, dto.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  async me(@Req() request: AuthenticatedRequest) {
    return this.getCurrentUser.execute(request.user.id);
  }
}
