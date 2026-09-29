import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { AuthTokenPayload } from '../../../../application/types/auth.types';
import { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';

// Access tokens are signed by JwtModule with jsonwebtoken's default HS256.
// Pinning the accepted algorithms keeps that guarantee in this codebase instead
// of relying on jsonwebtoken's implicit defaults (algorithm-confusion hardening).
const ACCEPTED_JWT_ALGORITHMS: Array<'HS256'> = ['HS256'];

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(UserRepositoryPort) private readonly users: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      algorithms: ACCEPTED_JWT_ALGORITHMS,
    });
  }

  async validate(payload: AuthTokenPayload) {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
