import { z } from 'zod';
import { validateEnvironment } from './env.validation';

const baseEnv = (): Record<string, unknown> => ({
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/clior_ecommerce',
  JWT_SECRET: 'a'.repeat(32),
  RESEND_VERIFICATION_TEMPLATE_ID: 'verification-template',
  RESEND_PASSWORD_RESET_TEMPLATE_ID: 'password-reset-template',
});

describe('validateEnvironment', () => {
  it('requires RESEND_API_KEY so config and runtime agree', () => {
    let thrown: unknown;
    try {
      validateEnvironment(baseEnv());
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(z.ZodError);
    const paths = (thrown as z.ZodError).issues.map((issue) => issue.path.join('.'));
    expect(paths).toContain('RESEND_API_KEY');
  });

  it('accepts a complete environment that includes the Resend key', () => {
    const result = validateEnvironment({ ...baseEnv(), RESEND_API_KEY: 're_test_key' });

    expect(result.RESEND_API_KEY).toBe('re_test_key');
    expect(result.RESEND_VERIFICATION_TEMPLATE_ID).toBe('verification-template');
  });
});
