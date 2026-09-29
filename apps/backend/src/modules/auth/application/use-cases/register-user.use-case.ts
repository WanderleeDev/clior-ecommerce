import { Injectable } from '@nestjs/common';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered.error';
import { normalizeEmail } from '../../domain/utils/normalize-email';
import { UserRegisteredEvent, USER_REGISTERED_EVENT } from '../../domain/events/user-registered.event';
import { EventBusPort } from '../ports/out/event-bus.port';
import { PasswordHasherPort } from '../ports/out/password-hasher.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { RegisterUserPort } from '../ports/in/register-user.port';
import type { RegisterUserInput } from '../types/auth.types';

@Injectable()
export class RegisterUserUseCase extends RegisterUserPort {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly eventBus: EventBusPort,
  ) {
    super();
  }

  async execute(input: RegisterUserInput): Promise<void> {
    // M13: canonicalize before the duplicate check so "Maria@" and "maria@" are
    // the same identity instead of two accounts.
    const email = normalizeEmail(input.email);
    const existing = await this.users.findByEmail(email);
    if (existing) throw new EmailAlreadyRegisteredError();

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.users.create({ ...input, email, passwordHash });
    this.eventBus.publish(USER_REGISTERED_EVENT, new UserRegisteredEvent(user));
  }
}
