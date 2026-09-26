import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserPort } from '../../../../application/ports/in/get-current-user.port';
import { LoginUserPort } from '../../../../application/ports/in/login-user.port';
import { RegisterUserPort } from '../../../../application/ports/in/register-user.port';
import { Public } from '../../../../../../shared/infrastructure/http/decorators/public.decorator';
import { ApiResponses } from '../../../../../../shared/infrastructure/http/decorators/api-responses.decorator';
import {
  CurrentUserDto,
  EmailDto,
  LoginDto,
  LoginResponseDto,
  PublicUserDto,
  RegisterDto,
  ResetPasswordDto,
  TokenDto,
} from './auth.dto';
import {
  LogoutPort,
  RefreshAuthPort,
  RequestPasswordResetPort,
  RequestVerificationPort,
  ResetPasswordPort,
  VerifyEmailPort,
} from '../../../../application/ports/in/auth-flow.ports';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { AuthResult, CurrentUser } from '../../../../application/types/auth.types';
import type { AuthUser } from '../../../../domain/models/auth-user';
import { InvalidRefreshTokenError } from '../../../../domain/errors/auth-flow.errors';

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/api/auth',
};

type IssuedAuthResult = Pick<AuthResult, 'accessToken' | 'refreshToken' | 'user'>;
type PublicAuthResult = Pick<IssuedAuthResult, 'accessToken'> & { user: PublicUserDto };

function readRefreshToken(request: Request): string {
  const token = request.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw new InvalidRefreshTokenError();
  return token;
}

function toPublicUser(user: AuthUser): PublicUserDto {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function setRefreshCookie(response: Response, result: IssuedAuthResult): PublicAuthResult {
  response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return { accessToken: result.accessToken, user: toPublicUser(result.user) };
}

type AuthenticatedRequest = Request & { user: AuthUser };

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
  @ApiResponses(
    { status: 201, description: 'User registered, verification email sent' },
    { status: 409, description: 'Email is already registered' },
  )
  async register(@Body() dto: RegisterDto) {
    await this.registerUser.execute(dto);
    return { message: 'Cuenta creada. Te enviamos un correo de verificación, revisa tu bandeja.' };
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponses(
    { status: 200, description: 'Authenticated user and tokens', type: LoginResponseDto },
    { status: 401, description: 'Invalid credentials or locked account' },
    { status: 403, description: 'Email address is not verified' },
  )
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return setRefreshCookie(response, await this.loginUser.execute(dto));
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  @ApiCookieAuth(REFRESH_COOKIE_NAME)
  @ApiOperation({ summary: 'Rotate a refresh token' })
  @ApiResponses(
    { status: 200, description: 'Rotated tokens', type: LoginResponseDto },
    { status: 401, description: 'Invalid, expired, or reused refresh token' },
  )
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return setRefreshCookie(response, await this.refreshAuth.execute(readRefreshToken(request)));
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  @ApiCookieAuth(REFRESH_COOKIE_NAME)
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiResponses({ status: 200, description: 'Session revoked' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.logoutUser.execute(readRefreshToken(request));
    response.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
  }

  @Post('verify-email')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify an email address' })
  @ApiBody({ type: TokenDto })
  @ApiResponses({ status: 200, description: 'Email verified' })
  async verify(@Body() dto: TokenDto): Promise<void> {
    await this.verifyEmail.execute(dto.token);
  }

  @Post('resend-verification')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request another verification email' })
  @ApiBody({ type: EmailDto })
  @ApiResponses({ status: 200, description: 'Verification email requested' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async resendVerification(@Body() dto: EmailDto): Promise<void> {
    await this.requestVerification.execute(dto.email);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: EmailDto })
  @ApiResponses({ status: 200, description: 'Password reset email requested' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async forgotPassword(@Body() dto: EmailDto): Promise<void> {
    await this.requestPasswordReset.execute(dto.email);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset a password with a one-time token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponses({ status: 200, description: 'Password reset' })
  async reset(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.resetPassword.execute(dto.token, dto.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponses(
    { status: 200, description: 'Authenticated user profile', type: CurrentUserDto },
    { status: 401, description: 'Missing or invalid access token' },
  )
  async me(@Req() request: AuthenticatedRequest): Promise<CurrentUser> {
    return this.getCurrentUser.execute(request.user);
  }
}
