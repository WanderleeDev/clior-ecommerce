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
  ],
  exports: [GetCurrentUserPort],
})
export class AuthModule {}
