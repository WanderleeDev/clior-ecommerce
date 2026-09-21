import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { GetCurrentUserPort } from './application/ports/in/get-current-user.port';
import { LoginUserPort } from './application/ports/in/login-user.port';
import { RegisterUserPort } from './application/ports/in/register-user.port';
import { EventBusPort } from './application/ports/out/event-bus.port';
import { PasswordHasherPort } from './application/ports/out/password-hasher.port';
import { TokenServicePort } from './application/ports/out/token-service.port';
import { UserRepositoryPort } from './application/ports/out/user-repository.port';
import { AuthController } from './infrastructure/adapters/in/http/auth.controller';
import { JwtStrategy } from './infrastructure/adapters/in/http/jwt.strategy';
import { Argon2PasswordHasher } from './infrastructure/adapters/out/security/argon2-password-hasher';
import { JwtTokenService } from './infrastructure/adapters/out/security/jwt-token.service';
import { PrismaUserRepository } from './infrastructure/adapters/out/persistence/prisma-user.repository';
import { NestEventBusAdapter } from './infrastructure/adapters/out/events/nest-event-bus.adapter';
import { OpaqueTokenPort } from './application/ports/out/opaque-token.port';
import { OpaqueTokenAdapter } from './infrastructure/adapters/out/security/opaque-token.adapter';
import { AuthTokenRepositoryPort } from './application/ports/out/auth-token-repository.port';
import { PrismaAuthTokenRepository } from './infrastructure/adapters/out/persistence/prisma-auth-token.repository';
import { RefreshSessionPort } from './application/ports/out/refresh-session.port';
import { PrismaRefreshSessionRepository } from './infrastructure/adapters/out/persistence/prisma-refresh-session.repository';
import { EmailSenderPort } from './application/ports/out/email-sender.port';
import { ResendEmailAdapter } from './infrastructure/adapters/out/email/resend-email.adapter';
import { AuthEmailListeners } from './infrastructure/adapters/out/events/auth-email.listeners';
import {
  LogoutPort,
  RefreshAuthPort,
  RequestPasswordResetPort,
  RequestVerificationPort,
  ResetPasswordPort,
  VerifyEmailPort,
} from './application/ports/in/auth-flow.ports';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshAuthUseCase } from './application/use-cases/refresh-auth.use-case';
import {
  RequestPasswordResetUseCase,
  RequestVerificationUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
} from './application/use-cases/email-auth.use-cases';
import { RolesGuard } from './infrastructure/adapters/in/http/roles.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRES_IN', 3600) },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: RegisterUserPort, useClass: RegisterUserUseCase },
    { provide: LoginUserPort, useClass: LoginUserUseCase },
    { provide: GetCurrentUserPort, useClass: GetCurrentUserUseCase },
    JwtStrategy,
    { provide: UserRepositoryPort, useClass: PrismaUserRepository },
    { provide: PasswordHasherPort, useClass: Argon2PasswordHasher },
    { provide: TokenServicePort, useClass: JwtTokenService },
    { provide: EventBusPort, useClass: NestEventBusAdapter },
    { provide: OpaqueTokenPort, useClass: OpaqueTokenAdapter },
    { provide: AuthTokenRepositoryPort, useClass: PrismaAuthTokenRepository },
    { provide: RefreshSessionPort, useClass: PrismaRefreshSessionRepository },
    { provide: EmailSenderPort, useClass: ResendEmailAdapter },
    { provide: RefreshAuthPort, useClass: RefreshAuthUseCase },
    { provide: LogoutPort, useClass: LogoutUseCase },
    { provide: VerifyEmailPort, useClass: VerifyEmailUseCase },
    { provide: RequestVerificationPort, useClass: RequestVerificationUseCase },
    { provide: RequestPasswordResetPort, useClass: RequestPasswordResetUseCase },
    { provide: ResetPasswordPort, useClass: ResetPasswordUseCase },
    AuthEmailListeners,
    RolesGuard,
  ],
  exports: [GetCurrentUserPort, RolesGuard],
})
export class AuthModule {}
