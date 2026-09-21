import { Injectable } from '@nestjs/common';
import { LogoutPort } from '../ports/in/auth-flow.ports';
import { RefreshSessionPort } from '../ports/out/refresh-session.port';

@Injectable()
export class LogoutUseCase extends LogoutPort {
  constructor(private readonly sessions: RefreshSessionPort) {
    super();
  }

  execute(token: string): Promise<void> {
    return this.sessions.revoke(token);
  }
}
