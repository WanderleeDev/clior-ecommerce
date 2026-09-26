import { Injectable } from '@nestjs/common';
import type { AuthUser } from '../../domain/models/auth-user';
import type { CurrentUser } from '../types/auth.types';
import { GetCurrentUserPort } from '../ports/in/get-current-user.port';
import { CurrentUserMapper } from '../mappers/current-user.mapper';

@Injectable()
export class GetCurrentUserUseCase extends GetCurrentUserPort {
  async execute(user: AuthUser): Promise<CurrentUser> {
    return CurrentUserMapper.toCurrentUser(user);
  }
}
