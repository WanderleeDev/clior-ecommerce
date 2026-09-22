import { z } from 'zod';

export const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600),
  PORT: z.coerce.number().int().positive().default(3000),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_VERIFICATION_TEMPLATE_ID: z.string().min(1),
  RESEND_PASSWORD_RESET_TEMPLATE_ID: z.string().min(1),
  MAIL_FROM: z.string().min(1).default('Clio <onboarding@resend.dev>'),
  APP_URL: z.string().url().default('http://localhost:4200'),
});

export function validateEnvironment(config: Record<string, unknown>) {
  return environmentSchema.parse(config);
}
