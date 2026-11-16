# US-002 — Cerrar sesión

| Field | Value |
| --- | --- |
| ID | `US-002` |
| Priority | Must |
| Story status | Ready |
| Implementation status | Mock |
| Route | `/cuenta` (action, no dedicated route) |
| Endpoint | `POST /api/auth/logout` |
| Depends on | US-001 (there is an active session) |
| Related | `POST /api/auth/refresh` |

## 1. Story

**As an** authenticated Clior Pets customer,
**I want** to sign out,
**so that** my session ends on this device and nobody else can use my account.

## 2. Context and value

The account page exposes a `Cerrar sesión` action. Signing out must be real, not cosmetic: the refresh token has to be revoked server-side, the cookie cleared, and the client state wiped. A cosmetic logout leaves a usable 30-day session behind.

## 3. Preconditions

- The customer has an active session (`refresh_token` cookie present).
- The customer is on `/cuenta` (or any authenticated screen) and can trigger the action.

## 4. Main flow

1. The customer activates `Cerrar sesión`.
2. The client calls `POST /api/auth/logout` with credentials (`refresh_token` cookie).
3. The backend revokes the refresh session row matching the presented token.
4. The backend clears the `refresh_token` cookie (`path=/api/auth`).
5. The client clears `AuthStore` and the in-memory access token.
6. The customer is redirected to `/`.
7. Visiting `/cuenta` again sends them to `/ingresar`.

## 5. Acceptance criteria

**AC-002-01 — Successful logout**
Given an active session,
When the customer activates `Cerrar sesión`,
Then the API returns `200`,
And the presented refresh token is revoked server-side (`revoked_at` set),
And the `refresh_token` cookie is removed from the browser.

**AC-002-02 — Client state cleared**
Given a successful logout,
Then `AuthStore` holds no user, the in-memory access token is discarded, and the header stops showing the account link.

**AC-002-03 — Protected routes closed**
Given a logged-out state,
When the customer opens `/cuenta` directly,
Then `authGuard` redirects to `/ingresar`.

**AC-002-04 — Server-side revocation is authoritative**
Given a copied refresh token from a logged-out session,
When someone calls `POST /api/auth/refresh` with it,
Then the API returns `401` and, because the token was already revoked, the session family is revoked.

**AC-002-05 — Logout is idempotent**
Given no `refresh_token` cookie (expired, already cleared, or another tab already logged out),
When the client calls logout,
Then the API should still answer `200` and the client still clears its state. *(Today: `401` — see D-08.)*

**AC-002-06 — Failure does not trap the customer**
Given the logout request fails (offline, 5xx),
Then the client still clears the local session and redirects, and shows a non-blocking notice that the server session could not be closed.

## 6. Edge cases and error states

| Trigger | Expected behavior | API |
| --- | --- | --- |
| Logout from two tabs | First tab revokes; second tab gets no cookie and must not error | `200` (target) |
| Token already revoked | Idempotent success, no user-facing error | `200` (target) |
| Network failure | Local session cleared; retry happens silently on next boot if a cookie survives | — |
| Cookie blocked by the browser | Local session still cleared | — |
| Stale access token used after logout | `401`; client never logs the user back in | `401` |

## 7. Non-functional criteria

- No confirmation modal by default (one click, reversible by logging in again). Revisit if accidental logouts show up.
- The action is a real `<button>`, reachable by keyboard, with an accessible name.
- No tokens or cookie values in logs, analytics or error reports.
- The redirect is client-side, no full page reload required.

## 8. Out of scope

- "Cerrar sesión en todos los dispositivos" (see D-05; backend supports `revokeAllForUser`).
- Session list / device management.
- Automatic logout on inactivity (session expiry is time-based, not idle-based).

## 9. Open product decisions

- **D-05** — Do we expose "cerrar sesión en todos los dispositivos"? It would call a future `POST /api/auth/logout-all`.
- **D-08** — Make logout idempotent (`200` without a cookie) instead of `401`.
- Should logout show a toast like `Sesión cerrada. ¡Vuelve pronto!`?

## 10. Current state and gaps

- `MockAuthAdapter.logout()` only clears the signal; no request leaves the browser.
- `account-page.ts` calls `auth.logout()` then `store.clear()` and navigates to `/`.
- Backend logout requires the refresh cookie (`readRefreshToken` throws `InvalidRefreshTokenError` when missing) and only revokes the presented token, not its family.
- No logout-all endpoint, no toast, no session list.

## 11. Traceability

| Layer | Path |
| --- | --- |
| UI | `apps/frontend/src/app/account/account-page.ts` |
| Mock adapter | `apps/frontend/src/app/auth/infrastructure/adapters/mock-auth.adapter.ts` |
| API controller | `apps/backend/src/modules/auth/infrastructure/adapters/in/http/auth.controller.ts` |
| Use case | `apps/backend/src/modules/auth/application/use-cases/logout.use-case.ts` |
| Session revocation | `apps/backend/src/modules/auth/infrastructure/adapters/out/persistence/prisma-refresh-session.repository.ts` |
| Tests | `auth.controller.spec.ts`, `prisma-refresh-session.repository.spec.ts` |
| Roadmap | P1-3, P3-1, P3-5 |
