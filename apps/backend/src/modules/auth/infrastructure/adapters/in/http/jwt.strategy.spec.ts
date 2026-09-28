import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserRepositoryPort } from '../../../../application/ports/out/user-repository.port';
import { JwtStrategy } from './jwt.strategy';

// @nestjs/passport ships ESM-only dist files, which the CJS jest runtime cannot
// parse (jest.config.js is out of scope for this fix). This mock mirrors the real
// PassportStrategy mixin (validate callback wired into the passport strategy),
// minus the global passport-instance registration, which unit tests do not need.
jest.mock('@nestjs/passport', () => ({
  PassportStrategy: (Strategy: unknown) => {
    return class StrategyWithMixin extends (Strategy as new (...args: any[]) => any) {
      constructor(...args: any[]) {
        const callback = async (...params: any[]) => {
          const done = params[params.length - 1];
          try {
            done(null, await this.validate(...params));
          } catch (err) {
            done(err, null);
          }
        };
        super(...args, callback);
      }
    };
  },
}));

const JWT_SECRET = 'local-jwt-secret-for-strategy-tests-32';

type VerifOpts = { algorithms?: string[] };
type Verifier = (
  token: string,
  secretOrKey: string,
  options: VerifOpts,
  done: (err: Error | null, payload?: unknown) => void,
) => void;

function base64url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

// Hand-rolled JWT so the spec can mint tokens with any algorithm without
// pulling an extra signing library into the test.
function signToken(payload: Record<string, unknown>, secret: string, algorithm: 'HS256' | 'HS512'): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: algorithm, typ: 'JWT' }));
  const claims = base64url(JSON.stringify({ ...payload, iat: now, exp: now + 3600 }));
  const signingInput = `${header}.${claims}`;
  const signature = createHmac(algorithm === 'HS256' ? 'sha256' : 'sha512', secret)
    .update(signingInput)
    .digest('base64url');

  return `${signingInput}.${signature}`;
}

function createStrategy(): JwtStrategy {
  const config = {
    getOrThrow: jest.fn().mockReturnValue(JWT_SECRET),
  } as unknown as ConfigService;
  const users = {
    findById: jest.fn(),
  } as unknown as UserRepositoryPort;

  return new JwtStrategy(config, users);
}

function verifOptsOf(strategy: JwtStrategy): VerifOpts {
  return (strategy as unknown as { _verifOpts: VerifOpts })._verifOpts;
}

function verifierOf(strategy: JwtStrategy): Verifier {
  const verifier = (strategy.constructor as unknown as { JwtVerifier?: Verifier }).JwtVerifier;
  if (!verifier) throw new Error('passport-jwt JwtVerifier static not found');
  return verifier;
}

describe('JwtStrategy', () => {
  it('pins the accepted algorithms to HS256', () => {
    expect(verifOptsOf(createStrategy()).algorithms).toEqual(['HS256']);
  });

  it('verifies access tokens signed with HS256', (done) => {
    const strategy = createStrategy();
    const token = signToken({ sub: 'user-1' }, JWT_SECRET, 'HS256');

    verifierOf(strategy)(token, JWT_SECRET, verifOptsOf(strategy), (err, payload) => {
      try {
        expect(err).toBeNull();
        expect(payload).toMatchObject({ sub: 'user-1' });
        done();
      } catch (assertionError) {
        done(assertionError as Error);
      }
    });
  });

  it('rejects a token signed with another algorithm even when the secret matches', (done) => {
    const strategy = createStrategy();
    const token = signToken({ sub: 'user-1' }, JWT_SECRET, 'HS512');

    verifierOf(strategy)(token, JWT_SECRET, verifOptsOf(strategy), (err) => {
      try {
        expect(err).toBeInstanceOf(Error);
        done();
      } catch (assertionError) {
        done(assertionError as Error);
      }
    });
  });
});
