import { Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { PasswordHasherPort } from '../ports/out/password-hasher.port';
import { TokenServicePort } from '../ports/out/token-service.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { LoginUserPort } from '../ports/in/login-user.port';
import type { AuthResult, LoginUserInput } from '../types/auth.types';

@Injectable()
export class LoginUserUseCase extends LoginUserPort {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
  ) {
    super();
  }

  async execute(input: LoginUserInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email);
    const valid = user ? await this.passwordHasher.verify(user.passwordHash, input.password) : false;
    if (!user || !valid) throw new InvalidCredentialsError();

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return {
      accessToken: await this.tokenService.sign({ sub: safeUser.id, email: safeUser.email }),
      user: safeUser,
    };
  }
}
