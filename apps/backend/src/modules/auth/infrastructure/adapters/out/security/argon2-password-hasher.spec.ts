import * as argon2 from 'argon2';
import {
  ARGON2_HASH_LENGTH,
  ARGON2_MEMORY_COST,
  ARGON2_PARALLELISM,
  ARGON2_TIME_COST,
  ARGON2_TYPE,
  ARGON2_VERSION,
  Argon2PasswordHasher,
} from './argon2-password-hasher';

describe('Argon2PasswordHasher', () => {
  it('pins every argon2 parameter instead of relying on library defaults', () => {
    expect(ARGON2_TYPE).toBe(argon2.argon2id);
    expect(ARGON2_HASH_LENGTH).toBe(32);
    expect(ARGON2_MEMORY_COST).toBe(65536);
    expect(ARGON2_TIME_COST).toBe(3);
    expect(ARGON2_PARALLELISM).toBe(4);
    expect(ARGON2_VERSION).toBe(19);
  });

  it('produces argon2id digests with the pinned parameters', async () => {
    const hasher = new Argon2PasswordHasher();

    const digest = await hasher.hash('correct horse battery staple');

    expect(digest).toMatch(/^\$argon2id\$v=19\$m=65536,p=4,t=3\$/);
    await expect(hasher.verify(digest, 'correct horse battery staple')).resolves.toBe(true);
    await expect(hasher.verify(digest, 'wrong-password')).resolves.toBe(false);
  });
});
