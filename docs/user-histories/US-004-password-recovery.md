# US-004 — Recuperar acceso

| Field | Value |
| --- | --- |
| ID | `US-004` |
| Priority | Must |
| Story status | Draft |
| Implementation status | Mock |
| Routes | `/recuperar` (request), `/restablecer?token=` (consume — missing) |
| Endpoints | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| Depends on | US-003 (account exists) |
| Related | US-001 (login with the new password) |

## 1. Story

**As a** Clior Pets customer who forgot the password,
**I want** to request a reset link and choose a new password,
**so that** I can get back into my account without creating a new one.

## 2. Context and value

The recovery flow protects revenue: a locked-out customer is a lost order. It must also resist abuse and account enumeration, because the email form is public.

The request screen already exists with the copy:

- Heading: `Recupera` + `tu acceso.`
- Subhead: `Te enviamos un enlace para restablecer tu contraseña.`
- Button: `Enviar enlace` / `Enviando…`
- Confirmation state: `Revisa tu correo` + `Si {email} está registrado, recibirás el enlace en unos minutos.` + `Volver a ingresar`
- Footer link: `¿Recordaste tu contraseña?` → `Inicia sesión`

The screen that consumes the token (`/restablecer?token=…`) does not exist yet.

## 3. Preconditions

- The customer owns the email address of an existing account (or types any email; the flow must not reveal which).

## 4. Main flow

1. The customer opens `/recuperar` from `/ingresar` (`¿Olvidaste tu contraseña?`).
2. They enter `Email` and activate `Enviar enlace`.
3. The client validates the email locally, then calls `POST /api/auth/forgot-password`.
4. The API always answers `200` and sends an email only when the account exists.
5. The UI switches to the `Revisa tu correo` state with the address typed.
6. The customer opens the email link (`/restablecer?token=…`), enters a new password twice, and submits.
7. The client calls `POST /api/auth/reset-password` with `{ token, password }`.
8. The backend consumes the one-time token, stores the new Argon2id hash, clears any lockout, and revokes every refresh session of that user.
9. The UI confirms success and sends the customer to `/ingresar`; the old password and all previous sessions no longer work.

## 5. Acceptance criteria

**AC-004-01 — Request always succeeds**
Given any email address (registered or not),
When the customer submits `/recuperar`,
Then the API returns `200` with an empty body,
And the UI shows `Revisa tu correo` with `Si {email} está registrado, recibirás el enlace en unos minutos.`,
And the response never reveals whether the account exists.

**AC-004-02 — Email delivery**
Given a registered account,
Then the email contains a single-use link with a token valid for 1 hour,
And the link opens the reset screen with the token prefilled from the query string.

**AC-004-03 — Previous links invalidated**
Given an earlier reset request,
When the customer requests a new link,
Then every outstanding reset token for that user is revoked before the new one is issued,
And only the most recent link works.

**AC-004-04 — Throttling**
Given more than 3 requests per minute from one client,
Then the API returns `429`,
And the UI shows a Spanish retry hint instead of a silent failure.

**AC-004-05 — New password policy**
Given the reset form,
Then the new password must be at least 12 characters and include a lowercase letter, an uppercase letter, a number and a symbol,
And the confirmation must match,
And the rules are explained in Spanish before submitting.

**AC-004-06 — Successful reset**
Given a valid, unexpired token and a compliant password,
When the customer submits,
Then the API returns `200`,
And the stored hash is updated,
And the failed-attempt counter and any lockout are cleared,
And every refresh session of that user is revoked (all devices logged out).

**AC-004-07 — Invalid or expired token**
Given a token that is expired, already used, or unknown,
When the customer submits,
Then the API returns `400` with `Invalid or expired token`,
And the UI explains it in Spanish and offers `Pedir un nuevo enlace`.

**AC-004-08 — Login with the new password**
Given a completed reset,
Then `POST /api/auth/login` succeeds with the new password,
And fails with the old one,
And any previously issued refresh cookie no longer refreshes.

## 6. Edge cases and error states

| Trigger | Expected behavior | API |
| --- | --- | --- |
| Email with spaces/mixed case | Normalized; same account looked up | — |
| Unknown email | Same `200` and same UI state; no email sent | `200` |
| Link opened twice | Second submit fails with `400`; UI offers a new link | `400` |
| Token copied to another browser | Works once, whoever uses it first | — |
| Reset while the account is locked | Lock cleared; customer can log in immediately | `200` |
| Reset while logged in elsewhere | Other sessions are revoked on success | — |
| Reset screen opened without a token | `Pedir un nuevo enlace` path, no form submit | — |
| Network failure on request | Retryable Spanish message; entered email preserved | — |

## 7. Non-functional criteria

- The token travels in the URL fragment-free query string once; the landing route sets `Referrer-Policy: no-referrer` and must not log the URL.
- The reset screen is reachable while logged out and never triggers an authenticated fetch.
- No password or token in logs, analytics or error reports.
- Confirmation and error messages are announced (`role="status"`, `role="alert"`).
- Full keyboard support and 360 px layout.
- Rate limiting applies per client IP; the UI must not retry automatically.

## 8. Out of scope

- Recovery by phone/SMS.
- Admin-initiated password reset.
- Forced password rotation or password history.
- Account unlock without resetting the password (the 15-minute lock expires by itself).
- Security notification email after a password change (candidate follow-up story).

## 9. Open product decisions

- **D-03** — Confirm the landing route name (`/restablecer?token=`) and the exact email link format.
- **D-06** — Register allows 8 characters, reset requires 12. Pick one policy; the reset rule is the stricter and safer baseline.
- **D-09** — Locked-account status: `ROADMAP` P3-4 expects `423`, the API returns `401`. Pick one (`401` is current behavior).
- Should a successful reset also send a "tu contraseña cambió" email? (Recommended.)
- Should the reset screen show the customer's email (decoded from the token) or stay anonymous?
- Do we want a `Pedir un nuevo enlace` cooldown identical to `resend-verification` (3/min)?

## 10. Current state and gaps

- `MockAuthAdapter.recover()` returns `undefined` immediately; no request, no email.
- `recover.view.ts` implements the form and the `Revisa tu correo` confirmation state with client-side email validation only.
- The reset screen, its route and the token handling do not exist (ROADMAP lists "password reset with token" as a missing route).
- No success confirmation after reset, no expired-token state, no resend cooldown.
- Backend side is complete: no-enumeration `200`, previous-token revocation, 1-hour one-time tokens, 12-character policy, lockout reset, revoke-all sessions.

## 11. Traceability

| Layer | Path |
| --- | --- |
| UI (request) | `apps/frontend/src/app/auth/presentation/views/recover.view.ts` |
| Mock adapter | `apps/frontend/src/app/auth/infrastructure/adapters/mock-auth.adapter.ts` |
| API controller | `apps/backend/src/modules/auth/infrastructure/adapters/in/http/auth.controller.ts` |
| DTO | `apps/backend/src/modules/auth/infrastructure/adapters/in/http/auth.dto.ts` (`ResetPasswordDto`) |
| Use cases | `apps/backend/src/modules/auth/application/use-cases/email-auth.use-cases.ts` |
| Token storage | `apps/backend/src/modules/auth/infrastructure/adapters/out/persistence/prisma-auth-token.repository.ts` |
| Session revocation | `apps/backend/src/modules/auth/infrastructure/adapters/out/persistence/prisma-refresh-session.repository.ts` |
| Tests | `password-reset-revocation.spec.ts`, `auth.use-cases.spec.ts`, `auth.dto.spec.ts`, `prisma-auth-token.repository.spec.ts` |
| Roadmap | P3-1, P3-3, P3-4 |
