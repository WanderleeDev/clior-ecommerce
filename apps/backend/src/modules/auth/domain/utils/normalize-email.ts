/**
 * Canonicalizes an email address so lookups and persistence always compare the
 * same value (M13).
 *
 * Case folding plus trimming removes the "same mailbox, different spelling"
 * duplicates that otherwise let one person own several accounts. The fold is
 * applied to the value we query with, never as `LOWER(email)` in the predicate,
 * so the unique index still serves the lookup.
 *
 * Out of scope: rows written before this rule existed keep their original
 * casing and will not match a folded lookup. Those need a one-off migration;
 * they cannot be fixed by folding at read time without giving up the index.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
