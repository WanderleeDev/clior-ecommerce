import { Inject, Injectable } from '@nestjs/common';
import type { AuthUser, AuthUserWithPassword } from '../../../../domain/models/auth-user';
import { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';
import type { RegisterUserInput } from '../../../../application/types/auth.types';
import { PrismaService } from '../../../../../../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
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

  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toUserWithPassword(user) : null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toUser(user) : null;
  }

  async markEmailVerified(id: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { emailVerifiedAt: new Date() } });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  async recordFailedLogin(id: string, attempts: number, lockedUntil: Date | null): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { failedLoginAttempts: attempts, lockedUntil } });
  }

  async resetFailedLogins(id: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
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
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
      passwordHash: user.passwordHash,
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
      createdAt: user.createdAt,
    };
  }
}
