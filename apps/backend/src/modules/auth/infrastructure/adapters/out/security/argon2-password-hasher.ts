import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordHasherPort } from '../../../../application/ports/out/password-hasher.port';

// Parameters are pinned explicitly (they match argon2@0.45's effective defaults)
// so a dependency bump cannot silently re-parameterize every stored hash.
// verify() reads the parameters from the encoded digest, so hashes created with
// older defaults keep verifying.
export const ARGON2_TYPE = argon2.argon2id;
export const ARGON2_HASH_LENGTH = 32;
export const ARGON2_MEMORY_COST = 65536; // KiB
export const ARGON2_TIME_COST = 3;
export const ARGON2_PARALLELISM = 4;
export const ARGON2_VERSION = 19; // 0x13

const ARGON2_OPTIONS: argon2.HashOptions = {
  type: ARGON2_TYPE,
  hashLength: ARGON2_HASH_LENGTH,
  memoryCost: ARGON2_MEMORY_COST,
  timeCost: ARGON2_TIME_COST,
  parallelism: ARGON2_PARALLELISM,
  version: ARGON2_VERSION,
};

@Injectable()
export class Argon2PasswordHasher extends PasswordHasherPort {
  hash(password: string): Promise<string> {
    return argon2.hash(password, ARGON2_OPTIONS);
  }

  verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
