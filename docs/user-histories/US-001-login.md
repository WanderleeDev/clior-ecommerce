# US-001 — Iniciar sesión

| Field | Value |
| --- | --- |
| ID | `US-001` |
| Priority | Must |
| Story status | Done |
| Implementation status | Real |
| Route | `/ingresar` |
| Endpoint | `POST /api/auth/login` |
| Depends on | US-003 (account exists and is verified) |
| Related | `GET /api/auth/me`, `POST /api/auth/refresh`, `POST /api/auth/logout` |

## 1. Story

**As a** returning Clior Pets customer,
**I want** to sign in with my email and password,
**so that** I can reach my account, my orders and my saved data.

## 2. Context and value

Login is the gate to the account area (`/cuenta`), the future order history and checkout. The page already exists with the copy:

- Heading: `Inicia` + `sesión.`
- Subhead: `Bienvenido de vuelta. Tu peludo te extrañó.`
- Button: `Ingresar` / `Ingresando…`
- Links: `¿Olvidaste tu contraseña?` (→ `/recuperar`), `Regístrate gratis` (→ `/registro`)

The backend already implements the full contract: Argon2id verification, lockout, verified-email gate, rotating refresh sessions and the `refresh_token` cookie.

## 3. Preconditions

- The customer registered through `/registro` and verified their email.
- The account is not locked (fewer than 5 consecutive failed attempts, or the 15-minute lock expired).

## 4. Main flow

1. The customer opens `/ingresar` (directly, or redirected by `authGuard` from a protected route).
2. They enter `Email` and `Contraseña`, then submit.
3. The client validates the fields locally (email format, password present) before calling the API.
4. `POST /api/auth/login` returns `200` with `{ accessToken, user }` and sets the `refresh_token` cookie.
5. The client stores the access token in memory and hydrates `AuthStore` with `user`.
6. The customer is redirected to `/cuenta`. (Return-to-original-URL after login is not implemented; the guard does not preserve a `returnUrl` yet.)
7. From then on, authenticated requests carry `Authorization: Bearer <accessToken>`; a `401` triggers a single-flight `POST /api/auth/refresh` and the original request is retried once.

## 5. Acceptance criteria

**AC-001-01 — Successful login**
Given a verified, unlocked account,
When the customer submits the correct email and password,
Then the API returns `200` with `accessToken` and `user`,
And an `httpOnly` `refresh_token` cookie is set with `path=/api/auth`,
And the customer lands on `/cuenta` with their name visible in the header.

**AC-001-02 — Wrong credentials**
Given any email/password pair that does not match an account,
When the customer submits,
Then the API returns `401` and the UI shows one generic Spanish message (never the raw `Invalid credentials`),
And the email field keeps its value and the password field is cleared,
And the message does not reveal whether the email exists.

**AC-001-03 — Unverified email**
Given an account whose email is not verified,
When the customer submits the correct credentials,
Then the API returns `403`,
And the UI explains that the email must be verified and offers `Reenviar correo` (`POST /api/auth/resend-verification`),
And no session is created.

**AC-001-04 — Locked account**
Given an account with 5 consecutive failed attempts in the last 15 minutes,
When the customer submits the correct password,
Then the API returns `401` with `Account is temporarily locked`,
And the UI explains the temporary lock without exposing account existence to a caller who did not prove the password.

**AC-001-05 — Local validation**
Given an empty or malformed form,
When the customer submits,
Then no request is sent,
And each invalid field shows its Spanish message and is announced to assistive technology.

**AC-001-06 — Submit state**
Given a request in flight,
Then the button reads `Ingresando…`, is disabled, and a second submit is impossible.

**AC-001-07 — Session bootstrapping**
Given a returning customer with a valid `refresh_token` cookie and no access token in memory,
When the app starts,
Then the client calls `POST /api/auth/refresh` once, hydrates the session, and does not show the login screen.

## 6. Edge cases and error states

| Trigger | Expected behavior | API |
| --- | --- | --- |
| Email with spaces or mixed case | Normalized before lookup; same account found | — |
| Password wrong 5 times | Account locked 15 min; further guesses do not extend the lock | `401` |
| Lock expires | Next correct login succeeds; failure counter resets | `200` |
| Refresh token reused | Whole session family revoked | `401` on `/refresh` |
| Network error / timeout | Retryable Spanish message, form data preserved | — |
| Throttled request | Spanish "demasiados intentos" message with retry hint | `429` |
| Already authenticated visiting `/ingresar` | Redirect to `/cuenta` | — |

## 7. Non-functional criteria

- The access token is never persisted to `localStorage`, `sessionStorage`, cookies readable by JS, or logs.
- `autocomplete="email"` and `autocomplete="current-password"` on the inputs.
- Error region uses `role="alert"` / `aria-live="polite"`.
- The screen is usable with keyboard only and at 360 px width.
- No auth call during prerender/SSR build (ROADMAP: keep public pages prerendered, protect authenticated fetches).

## 8. Out of scope

- Social login (Google, Apple).
- "Remember me" (session length is cookie-driven).
- Two-factor authentication.
- Admin/role-based redirects (Phase P8).
- Password visibility toggle.

## 9. Open product decisions

- **D-01** — Spanish mapping for the fixed English API messages. Implemented: `auth-error.mapper.ts`
  maps status + message into typed Spanish `AuthError`s; no view sees raw English text.
- **D-07** — Confirm 30-day sliding / 90-day absolute session expectations. Still proposed: the
  cookie `Max-Age=2592000` (30 days) matches the sliding window; product confirmation pending.
- **D-09** — Resolved: keep `401` for locked accounts (current API behavior). The UI maps the fixed
  `Account is temporarily locked` message to Spanish; the ROADMAP P3-4 `423` expectation is superseded.
- Post-login redirect with no intended URL: resolved to `/cuenta` (verified live).
- Should a throttled login show a countdown? Still open: today only the Spanish "demasiados intentos"
  message is shown, no countdown.

## 10. Current state and gaps

Implemented end to end and verified against the running API (through the Cloudflare tunnel
`https://clior-dev.wanderlee.site`):

- `POST /api/auth/login` → `200 {accessToken,user}` + `httpOnly` `refresh_token` cookie
  (`Path=/api/auth`, `SameSite=Lax`, `Max-Age=2592000`); `401` on wrong credentials or lockout,
  `403` on unverified email. The proxy-trust fix (D-11, `applyProxyTrust` in `main.ts`) lets the
  cookie policy see `https` behind the TLS-terminating tunnel.
- The frontend calls the real API through `AuthRepositoryPort` → `HttpAuthAdapter`; the access token
  lives only in `SessionService` (memory), never in storage. `authInterceptor` attaches the bearer
  and, on `401`, runs a single-flight `POST /api/auth/refresh` and retries the original request once.
- Bootstrap: `provideAppInitializer` issues one `POST /api/auth/refresh` before first navigation and
  hydrates `AuthStore`; it is skipped on the server platform so prerender/SSR sends no auth traffic.
- `MOCK_SESSION` and `MockAuthAdapter` are removed; `AuthStore` starts logged out.
- The login form uses `novalidate` + signal-forms so the Spanish field errors run (the native English
  bubble no longer blocks submit); errors are announced (`role="alert"` / `aria-live="polite"`), the
  password is cleared and the email kept on failure, and the unverified `403` offers `Reenviar correo`
  on a 60-second cooldown.
- The navbar shows the signed-in user's name; `/cuenta` renders the real user (friendly pet placeholder
  when `petType` is null); an authenticated visit to `/ingresar` redirects to `/cuenta`.
- Tests: full backend `jest` (19 suites / 129 tests) + `nest build`, and frontend `nx test frontend`
  (12 files / 70 tests) + `nx lint frontend` + `nx build frontend` — all green on 2026-11-16.

Pending / external:

- Password recovery landing `/restablecer?token=` belongs to US-004 (the `/recuperar` screen already
  calls the real `POST /api/auth/forgot-password`).
- Logout idempotency without a cookie (D-08) and "logout everywhere" (D-05) belong to US-002.
- The product catalog still uses `MockProductAdapter` (US-005 onward); its hardcoded review author is
  unrelated to the auth user and out of scope here.

## 11. Traceability

| Layer | Path |
| --- | --- |
| UI | `apps/frontend/src/app/auth/presentation/views/login.view.ts` |
| State / guard | `apps/frontend/src/app/auth/presentation/state/auth.store.ts`, `auth/presentation/guards/auth.guard.ts` |
| Session (in-memory token, single-flight refresh) | `apps/frontend/src/app/auth/infrastructure/session/session.service.ts` |
| HTTP adapter | `apps/frontend/src/app/auth/infrastructure/adapters/http-auth.adapter.ts` |
| Interceptor (bearer, refresh-on-401) | `apps/frontend/src/app/auth/infrastructure/http/auth.interceptor.ts` |
| User / error mapping | `apps/frontend/src/app/auth/infrastructure/adapters/auth-user.mapper.ts`, `auth-error.mapper.ts` |
| Bootstrap / bindings | `apps/frontend/src/app/app.config.ts` |
| Proxy trust (D-11) | `apps/backend/src/main.ts`, `apps/backend/src/shared/infrastructure/http/proxy-trust.ts` |
| API controller | `apps/backend/src/modules/auth/infrastructure/adapters/in/http/auth.controller.ts` |
| Use case | `apps/backend/src/modules/auth/application/use-cases/login-user.use-case.ts` |
| Refresh session | `apps/backend/src/modules/auth/infrastructure/adapters/out/persistence/prisma-refresh-session.repository.ts` |
| Tests | `login.view.spec.ts`, `navbar.spec.ts`, `account-page.spec.ts`, `session.service.spec.ts`, `http-auth.adapter.spec.ts`, `auth.interceptor.spec.ts`, `auth-user.mapper.spec.ts`, `auth-error.mapper.spec.ts`, `proxy-trust.spec.ts`, `auth.use-cases.spec.ts`, `auth.controller.spec.ts`, `prisma-refresh-session.repository.spec.ts` |
| Roadmap | P1-2, P1-3, P1-5, P3-1, P3-2, P3-4, P3-6 |
