import { createHash, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { OpaqueTokenPort } from '../../../../application/ports/out/opaque-token.port';

@Injectable()
export class OpaqueTokenAdapter extends OpaqueTokenPort {
  generate(): string {
    return randomBytes(32).toString('hex');
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
