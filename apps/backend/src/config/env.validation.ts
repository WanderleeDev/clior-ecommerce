import { z } from 'zod';

export const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600),
  PORT: z.coerce.number().int().positive().default(3000),
});

export function validateEnvironment(config: Record<string, unknown>) {
  return environmentSchema.parse(config);
}
