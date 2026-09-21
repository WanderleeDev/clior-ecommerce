import { Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { PasswordHasherPort } from '../ports/out/password-hasher.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { LoginUserPort } from '../ports/in/login-user.port';
import type { AuthResult, LoginUserInput } from '../types/auth.types';
import { RefreshSessionPort } from '../ports/out/refresh-session.port';
import { AccountLockedError } from '../../domain/errors/auth-flow.errors';

@Injectable()
export class LoginUserUseCase extends LoginUserPort {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly sessions: RefreshSessionPort,
  ) {
    super();
  }

  async execute(input: LoginUserInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email);
    if (user?.lockedUntil && user.lockedUntil > new Date()) throw new AccountLockedError();
    const valid = user ? await this.passwordHasher.verify(user.passwordHash, input.password) : false;
    if (!user || !valid) {
      if (user) {
        const attempts = user.failedLoginAttempts + 1;
        await this.users.recordFailedLogin(user.id, attempts, attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null);
      }
      throw new InvalidCredentialsError();
    }

    await this.users.resetFailedLogins(user.id);
    return this.sessions.create(user.id);
  }
}
