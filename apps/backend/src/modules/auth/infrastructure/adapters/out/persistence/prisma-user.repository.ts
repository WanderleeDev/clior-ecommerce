import { Inject, Injectable } from '@nestjs/common';
import type { AuthUser, AuthUserWithPassword } from '../../../../domain/models/auth-user';
import { normalizeEmail } from '../../../../domain/utils/normalize-email';
import { EmailAlreadyRegisteredError } from '../../../../domain/errors/email-already-registered.error';
import { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';
import type { RegisterUserInput } from '../../../../application/types/auth.types';
import { PrismaService } from '../../../../../../prisma/prisma.service';

/**
 * M8: register is check-then-create, so two concurrent requests can both pass
 * the duplicate check. Prisma reports the unique-constraint race as P2002; the
 * exception filter already maps EmailAlreadyRegisteredError to 409, while an
 * unhandled P2002 would surface as a 500.
 */
function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

@Injectable()
export class PrismaUserRepository extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: RegisterUserInput & { passwordHash: string }): Promise<AuthUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          // M13: canonicalize at the persistence boundary too, so the unique
          // constraint is enforced on the normalized address.
          email: normalizeEmail(input.email),
          name: input.name,
          passwordHash: input.passwordHash,
        },
      });
      return this.toUser(user);
    } catch (error) {
      if (isUniqueViolation(error)) throw new EmailAlreadyRegisteredError();
      throw error;
    }
  }

  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    const user = await this.prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
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

  /**
   * M6: `/me` and any other public projection must carry identity only. The
   * lockout columns are internal state and leak account-lock timing to callers.
   */
  private toUser(user: AuthUserWithPassword): AuthUser {
    const {
      passwordHash: _passwordHash,
      failedLoginAttempts: _failedLoginAttempts,
      lockedUntil: _lockedUntil,
      ...safeUser
    } = user;
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
