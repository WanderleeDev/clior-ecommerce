import { z } from 'zod';

export const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600),
  PORT: z.coerce.number().int().positive().default(3000),
  // Email delivery is essential to auth flows (password reset and email
  // verification both depend on it) and the two template ids below are already
  // required, so the Resend key is required too: the app fails fast at boot
  // with a clear validation error instead of crashing later inside
  // ResendEmailAdapter.getOrThrow or running with silently broken auth
  // flows (M12: config and runtime must agree).
  RESEND_API_KEY: z.string().min(1),
  RESEND_VERIFICATION_TEMPLATE_ID: z.string().min(1),
  RESEND_PASSWORD_RESET_TEMPLATE_ID: z.string().min(1),
  MAIL_FROM: z.string().min(1).default('Clio <onboarding@resend.dev>'),
  APP_URL: z.string().url().default('http://localhost:4200'),
});

export function validateEnvironment(config: Record<string, unknown>) {
  return environmentSchema.parse(config);
}
