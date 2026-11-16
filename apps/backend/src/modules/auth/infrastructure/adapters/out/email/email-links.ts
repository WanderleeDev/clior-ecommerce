/**
 * Single source of truth for the links we put in transactional emails.
 *
 * The frontend owns these routes (`/verificar`, `/restablecer`); both the
 * Resend transport and the development log transport build them here so a
 * rename cannot drift between transports.
 */

export const VERIFY_EMAIL_PATH = '/verificar';
export const RESET_PASSWORD_PATH = '/restablecer';

export function verificationUrl(appUrl: string, token: string): string {
  return `${appUrl}${VERIFY_EMAIL_PATH}?token=${encodeURIComponent(token)}`;
}

export function passwordResetUrl(appUrl: string, token: string): string {
  return `${appUrl}${RESET_PASSWORD_PATH}?token=${encodeURIComponent(token)}`;
}
