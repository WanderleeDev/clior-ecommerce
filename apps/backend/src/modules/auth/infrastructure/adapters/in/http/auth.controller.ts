import {
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailAlreadyRegisteredError } from '../../../../domain/errors/email-already-registered.error';
import { InvalidCredentialsError } from '../../../../domain/errors/invalid-credentials.error';
import { UserNotFoundError } from '../../../../domain/errors/user-not-found.error';
import { AccountLockedError, EmailNotVerifiedError, InvalidOneTimeTokenError } from '../../../../domain/errors/auth-flow.errors';
import { GetCurrentUserPort } from '../../../../application/ports/in/get-current-user.port';
import { LoginUserPort } from '../../../../application/ports/in/login-user.port';
import { RegisterUserPort } from '../../../../application/ports/in/register-user.port';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, RegisterDto } from './auth.dto';
import { EmailDto, RefreshTokenDto, ResetPasswordDto, TokenDto } from './auth.dto';
import {
  LogoutPort,
  RefreshAuthPort,
  RequestPasswordResetPort,
  RequestVerificationPort,
  ResetPasswordPort,
  VerifyEmailPort,
} from '../../../../application/ports/in/auth-flow.ports';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

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
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered and tokens issued' })
  @ApiResponse({ status: 409, description: 'Email is already registered' })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.registerUser.execute(dto);
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Authenticated user and tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or locked account' })
  @ApiResponse({ status: 403, description: 'Email address is not verified' })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUser.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof AccountLockedError) throw new UnauthorizedException(error.message);
      if (error instanceof EmailNotVerifiedError) throw new ForbiddenException(error.message);
      throw error;
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rotate a refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 401, description: 'Invalid, expired, or reused refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    try {
      return await this.refreshAuth.execute(dto.token);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.logoutUser.execute(dto.token);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify an email address' })
  @ApiBody({ type: TokenDto })
  async verify(@Body() dto: TokenDto): Promise<void> {
    try {
      await this.verifyEmail.execute(dto.token);
    } catch (error) {
      if (error instanceof InvalidOneTimeTokenError) throw new BadRequestException(error.message);
      throw error;
    }
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Request another verification email' })
  @ApiBody({ type: EmailDto })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async resendVerification(@Body() dto: EmailDto): Promise<void> {
    await this.requestVerification.execute(dto.email);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: EmailDto })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async forgotPassword(@Body() dto: EmailDto): Promise<void> {
    await this.requestPasswordReset.execute(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset a password with a one-time token' })
  @ApiBody({ type: ResetPasswordDto })
  async reset(@Body() dto: ResetPasswordDto): Promise<void> {
    try {
      await this.resetPassword.execute(dto.token, dto.password);
    } catch (error) {
      if (error instanceof InvalidOneTimeTokenError) throw new BadRequestException(error.message);
      throw error;
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: AuthenticatedRequest) {
    try {
      return await this.getCurrentUser.execute(request.user.id);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
}
