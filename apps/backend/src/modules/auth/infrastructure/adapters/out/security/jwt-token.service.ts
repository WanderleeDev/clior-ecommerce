import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../../../application/ports/out/token-service.port';
import type { AuthTokenPayload } from '../../../../application/types/auth.types';

@Injectable()
export class JwtTokenService extends TokenServicePort {
  constructor(private readonly jwt: JwtService) {
    super();
  }

  sign(payload: AuthTokenPayload): Promise<string> {
    return Promise.resolve(this.jwt.sign(payload));
  }
}
