# User Stories — Clior Pets

> Scope: customer-facing behavior, written against the real API contract in `apps/backend/src/modules/**` and the current Angular views.
> Companions: `ROADMAP.md`, `apps/backend/README.md`, `docs/db-schema-erd.html`.

This folder captures product intent per user story: what the customer wants, what the system must do, and what is still missing between the mock UI and the real backend.

---

## 1. Conventions

| Item | Rule |
| --- | --- |
| Folder | `docs/user-histories/` (kebab-case, no spaces) |
| File | `US-<number>-<slug>.md` — one story per file |
| Story ID | `US-001` onward, stable, never reused |
| Criteria ID | `AC-<US>-<nn>` (e.g. `AC-003-04`), stable |
| Decision ID | `D-<nn>` in the shared decision log below |
| Language | English prose; UI copy quoted **verbatim in Spanish (Peru)** |
| Currency | PEN, formatted `S/` with 2 decimals |
| Voice | warm, playful, second person (`tu peludo`, `tu mascota`) |

### Status legend

Story status: `Draft` · `Ready` · `In progress` · `Done` · `Blocked`
Implementation status per story: `Mock` (UI only) · `Partial` (some real calls) · `Real` (end to end)

### Story template

1. Header (ID, priority, status, routes, endpoints)
2. Story statement (As a / I want / So that)
3. Context and value
4. Preconditions
5. Main flow
6. Acceptance criteria (Given/When/Then)
7. Edge cases and error states (table)
8. Non-functional criteria
9. Out of scope
10. Open product decisions
11. Current state and gaps
12. Traceability

---

## 2. Index

| ID | Story | Route | API | Priority | Story status | Impl. status |
| --- | --- | --- | --- | --- | --- | --- |
| [US-001](US-001-login.md) | Iniciar sesión | `/ingresar` | `POST /api/auth/login` | Must | Ready | Mock |
| [US-002](US-002-logout.md) | Cerrar sesión | `/cuenta` (action) | `POST /api/auth/logout` | Must | Ready | Mock |
| [US-003](US-003-register.md) | Registrarse | `/registro`, `/verificar?token=` | `POST /api/auth/register`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification` | Must | Done | Real |
| [US-004](US-004-password-recovery.md) | Recuperar acceso | `/recuperar`, `/restablecer?token=` | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` | Must | Draft | Mock |

Next candidates: see the full backlog catalog in [`docs/USER-STORIES.md`](../USER-STORIES.md) (US-005 onward: catalog, product detail, brands, cart, checkout, payments, orders, profile, addresses, reviews, admin, contact).

---

## 3. Shared auth model

Facts the four stories depend on. Source of truth: `apps/backend/src/modules/auth`.

| Concern | Behavior |
| --- | --- |
| Access token | JWT returned in the response body, `{ sub }` claim only, TTL `JWT_EXPIRES_IN` (default 3600 s). Kept in memory on the client, never in `localStorage`. |
| Refresh token | Opaque, hashed at rest, sent as `httpOnly` cookie `refresh_token`, `path=/api/auth`, `SameSite=Lax` same-site / `None+Secure` cross-site, `Secure` when `NODE_ENV=production`. |
| Session lifetime | Sliding 30 days per rotation, absolute cap 90 days per session family. |
| Rotation | Single-flight rotation on `POST /api/auth/refresh`; reuse of a revoked token revokes the whole family. |
| Login/refresh body | `{ accessToken, user }` with `user = { id, email, name, role }`. |
| Password hashing | Argon2id. |
| Login protection | 5 failed attempts → 15 min lock. Decoy hash keeps timing equal for unknown emails. Lock expires instead of re-locking. |
| Email normalization | Trimmed and lower-cased at the HTTP boundary, so duplicates are case-insensitive. |
| One-time tokens | Verification and password reset tokens are opaque, stored hashed, single-use, TTL 1 hour. |
| Error envelope | `{ statusCode, message }` with fixed public messages (details stay in logs). |

Fixed public API messages (today in English — see D-01):

| Situation | Status | Message |
| --- | --- | --- |
| Wrong email or password | 401 | `Invalid credentials` |
| Locked account | 401 | `Account is temporarily locked` |
| Unverified email at login | 403 | `Email address must be verified before login` |
| Duplicate registration | 409 | `Email is already registered` |
| Invalid/expired one-time token | 400 | `Invalid or expired token` |
| Missing/invalid refresh cookie | 401 | `Invalid refresh token` |
| Missing/invalid access token | 401 | JWT guard response |

---

## 4. Cross-cutting non-functional baseline

Applies to every story in this folder unless the story says otherwise.

- **Security**: no secrets or tokens in URLs except one-time email links; no user enumeration; no credentials in logs or analytics; all auth transport over HTTPS.
- **Accessibility**: every field has a `<label>`, errors are announced (`aria-live`), focus moves to the first invalid field, contrast meets WCAG 2.1 AA.
- **Responsive**: usable from 360 px to desktop; auth forms never overflow.
- **Copy**: Spanish (Peru), sentence case, warm tone; no English strings exposed to the customer.
- **Performance**: auth screens render in under 2 s on a mid-range phone over 4G; no blocking third-party scripts.
- **Resilience**: network failures show a retryable message; the form keeps the user's input.

---

## 5. Definition of Ready

A story can be estimated when: the route exists or is specified, the endpoint and payloads are named, acceptance criteria cover success and failure, open decisions that block design are resolved, and the current mock behavior is documented.

## 6. Definition of Done

- Every acceptance criterion verified against the real API (not the mock).
- Backend tests cover the rules the story names; frontend has at least one test for the happy path and one for the main error.
- Copy reviewed in Spanish (Peru) and quoted strings match the implementation.
- No `MOCK_SESSION`, no `MockAuthAdapter` binding on the shipped path for this flow.
- Accessibility checks: keyboard-only run, labels, error announcement.
- This document updated: status, impl. status, and any decision log entry.

---

## 7. Decision log (product)

| ID | Decision | Status | Notes |
| --- | --- | --- | --- |
| D-01 | Map backend English messages to Spanish UI copy in one client-side mapping layer | Implemented (US-003 slice) | `auth-error.mapper.ts` translates status + message into typed `AuthError`s; the API stays English and no view sees raw text. |
| D-02 | Registration does not auto-login; the user must verify email first | Implemented | `/registro` shows the `Revisa tu correo` panel instead of redirecting; matches backend `EmailNotVerifiedError`. |
| D-03 | Email link routes: `/verificar?token=` and `/restablecer?token=` | Implemented for verification | `email-links.ts` builds both; `/verificar` is client-rendered (RenderMode.Client) so the single-use token is never spent by SSR/prerender. `/restablecer` landing is US-004. |
| D-04 | Collect `Tu mascota` at registration? | Implemented | Optional provided select (`dog` / `cat` / `small_pet`, default `Prefiero no decir`). Persisted as `User.petType` (nullable) and used for catalog personalization; free text is rejected by `@IsIn`. |
| D-05 | Offer "cerrar sesión en todos los dispositivos" | Open | Backend can revoke all sessions (`revokeAllForUser`), but logout only revokes the current token. |
| D-06 | Password policy: 8 chars on register vs 12 on reset | Open (register side implemented) | Register enforces and mirrors client-side the backend `@IsStrongPassword` (8+, lower, upper, number, symbol). The 12-char reset rule still needs one decision in US-004. |
| D-07 | Session length: 30-day sliding, 90-day absolute | Proposed | Behind the `refresh_token` cookie; confirm it matches customer expectation. |
| D-08 | Logout without a refresh cookie must be idempotent (200) | Open | Current API answers 401 because the cookie is required. |
| D-09 | Locked-account status code: `423` vs `401` | Open | `ROADMAP` P3-4 expects `423`; the API returns `401`. |
| D-10 | Transactional email transport is configurable per environment | Implemented | `MAIL_TRANSPORT=resend` (default) sends through Resend; `MAIL_TRANSPORT=log` writes the action link to the application log for local development and refuses `NODE_ENV=production`. |
| D-11 | Login behind a TLS-terminating proxy | Open | The refresh-cookie policy compares `APP_URL` with `request.protocol`; without trusting proxy headers an `https` `APP_URL` behind the Cloudflare tunnel resolves as cross-site and login answers `500`. US-001 owns the fix. |
