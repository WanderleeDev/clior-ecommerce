import type { AuthTokenPayload } from '../../types/auth.types';

export abstract class TokenServicePort {
  abstract sign(payload: AuthTokenPayload): Promise<string>;
}
