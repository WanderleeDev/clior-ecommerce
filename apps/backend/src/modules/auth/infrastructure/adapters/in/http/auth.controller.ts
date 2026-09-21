import {
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailAlreadyRegisteredError } from '../../../../domain/errors/email-already-registered.error';
import { InvalidCredentialsError } from '../../../../domain/errors/invalid-credentials.error';
import { UserNotFoundError } from '../../../../domain/errors/user-not-found.error';
import { GetCurrentUserPort } from '../../../../application/ports/in/get-current-user.port';
import { LoginUserPort } from '../../../../application/ports/in/login-user.port';
import { RegisterUserPort } from '../../../../application/ports/in/register-user.port';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, RegisterDto } from './auth.dto';
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
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
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
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUser.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user' })
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
