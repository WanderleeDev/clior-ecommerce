import { Inject, Injectable } from '@nestjs/common';
import type { AuthUser, AuthUserWithPassword } from '../../../../domain/models/auth-user';
import { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';
import type { RegisterUserInput } from '../../../../application/types/auth.types';
import { PRISMA_CLIENT, PrismaService } from '../../../../../../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository extends UserRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaService) {
    super();
  }

  async create(input: RegisterUserInput & { passwordHash: string }): Promise<AuthUser> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: input.passwordHash,
      },
    });
    return this.toUser(user);
  }

  async findByEmail(email: string): Promise<AuthUserWithPassword | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toUserWithPassword(user) : undefined;
  }

  async findById(id: string): Promise<AuthUser | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toUser(user) : undefined;
  }

  private toUser(user: AuthUserWithPassword): AuthUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private toUserWithPassword(user: AuthUserWithPassword): AuthUserWithPassword {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  }
}
