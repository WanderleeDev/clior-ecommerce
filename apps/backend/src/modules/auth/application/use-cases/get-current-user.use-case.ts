import { Injectable } from '@nestjs/common';
import type { AuthUser } from '../../domain/models/auth-user';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { GetCurrentUserPort } from '../ports/in/get-current-user.port';

@Injectable()
export class GetCurrentUserUseCase extends GetCurrentUserPort {
  constructor(private readonly users: UserRepositoryPort) {
    super();
  }

  async execute(userId: string): Promise<AuthUser> {
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}
