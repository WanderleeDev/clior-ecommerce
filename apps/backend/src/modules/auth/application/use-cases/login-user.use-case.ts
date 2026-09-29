import { Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { normalizeEmail } from '../../domain/utils/normalize-email';
import type { AuthUserWithPassword } from '../../domain/models/auth-user';
import { PasswordHasherPort } from '../ports/out/password-hasher.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { LoginUserPort } from '../ports/in/login-user.port';
import type { AuthResult, LoginUserInput } from '../types/auth.types';
import { RefreshSessionPort } from '../ports/out/refresh-session.port';
import { AccountLockedError, EmailNotVerifiedError } from '../../domain/errors/auth-flow.errors';

/**
 * Stand-in argon2id hash verified for emails that match no account.
 *
 * M7: without it the unknown-email path would skip argon2 entirely, so response
 * time would separate "no such user" from "wrong password". Verifying this hash
 * costs the same work as a real verification and can never succeed.
 */
const DECOY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,p=4,t=3$GrpGm+CJGw5XSLtukqDTiw$csJvtc8CnVA0yRVaSvasDXKsj0+BWTH22bkzGCgkMdM';

const FAILED_ATTEMPT_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

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
    const user = await this.users.findByEmail(normalizeEmail(input.email));

    // H3/M7: verification always runs before the lock is consulted. Checking the
    // lock first would (a) skip the argon2 work a wrong guess must always pay, so
    // timing would reveal account state, and (b) answer "locked" to a caller who
    // never proved the password.
    const valid = await this.passwordHasher.verify(
      user?.passwordHash ?? DECOY_PASSWORD_HASH,
      input.password,
    );

    if (!user || !valid) {
      // H3: an account that is already locked is never extended by further
      // guesses, so an attacker cannot keep a victim locked indefinitely.
      if (user && !this.isLocked(user)) {
        await this.recordFailedAttempt(user);
      }
      throw new InvalidCredentialsError();
    }

    // Only reachable with a correct password, so this cannot be used to test
    // whether an account exists (M7).
    if (this.isLocked(user)) throw new AccountLockedError();

    await this.users.resetFailedLogins(user.id);
    if (!user.emailVerifiedAt) throw new EmailNotVerifiedError();
    return this.sessions.create(user.id);
  }

  private isLocked(user: Pick<AuthUserWithPassword, 'lockedUntil'>): boolean {
    return Boolean(user.lockedUntil && user.lockedUntil > new Date());
  }

  private async recordFailedAttempt(user: AuthUserWithPassword): Promise<void> {
    // H3: an expired lock decays back to a fresh counter instead of instantly
    // re-locking, which is what turned the old code into a permanent lockout.
    const base = user.lockedUntil ? 0 : user.failedLoginAttempts;
    const attempts = base + 1;
    const lockedUntil =
      attempts >= FAILED_ATTEMPT_THRESHOLD ? new Date(Date.now() + LOCK_DURATION_MS) : null;
    await this.users.recordFailedLogin(user.id, attempts, lockedUntil);
  }
}
