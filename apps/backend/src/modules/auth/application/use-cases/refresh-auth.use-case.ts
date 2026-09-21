import { Injectable } from '@nestjs/common';
import { RefreshAuthPort } from '../ports/in/auth-flow.ports';
import { RefreshSessionPort } from '../ports/out/refresh-session.port';

@Injectable()
export class RefreshAuthUseCase extends RefreshAuthPort {
  constructor(private readonly sessions: RefreshSessionPort) {
    super();
  }

  execute(token: string) {
    return this.sessions.rotate(token);
  }
}
