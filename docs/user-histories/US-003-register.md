# US-003 — Registrarse

| Field | Value |
| --- | --- |
| ID | `US-003` |
| Priority | Must |
| Story status | In progress |
| Implementation status | Real |
| Route | `/registro`, `/verificar?token=` |
| Endpoints | `POST /api/auth/register`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification` |
| Depends on | — |
| Related | US-001 (login after verification), US-004 (password reset landing) |

## 1. Story

**As a** new visitor,
**I want** to create an account with my name, email and password,
**so that** I can buy, track my orders and keep my pet's data in one place.

## 2. Context and value

Registration is the first real customer commitment and the entry point to the account area. The screen copy:

- Heading: `Crea` + `tu cuenta.`
- Subhead: `Únete a la manada. Envío gratis desde S/ 99.`
- Button: `Crear cuenta` / `Creando cuenta…`
- Fields: `Nombre`, `Email`, `Contraseña` (placeholder `Mínimo 8 caracteres`), `Confirmar`,
  `Tu mascota (opcional)`
- Pet select options: `Prefiero no decir`, `Perro`, `Gato`, `Mascota pequeña`
- Closing link back to `/ingresar`

The backend creates the user, hashes the password with Argon2id and sends a verification email.
Login is blocked until the email is verified. The pet type is optional and only used to personalize
catalog recommendations.

## 3. Preconditions

- The visitor has an email address they can access.
- No account exists for that email (case-insensitive).

## 4. Main flow

1. The visitor opens `/registro` from the header or the login screen (`Regístrate gratis`).
2. They fill `Nombre`, `Email`, `Contraseña`, `Confirmar` and, optionally, `Tu mascota`.
3. The client validates locally: name ≥ 2 characters after trimming, valid email, password ≥ 8
   characters with a lowercase letter, an uppercase letter, a number and a symbol, passwords match.
   The first invalid field receives focus and no request is sent.
4. `POST /api/auth/register` returns `201` with
   `{ message: 'Cuenta creada. Te enviamos un correo de verificación, revisa tu bandeja.' }`.
5. The backend publishes the registration event and sends the verification email through the
   configured transport (Resend in production, the application log with `MAIL_TRANSPORT=log`).
6. The screen switches to the `Revisa tu correo` panel (`role="status"`) with the address, a
   `Reenviar correo` action on a 60-second cooldown and a `Volver a ingresar` link. There is no
   auto-login and no redirect that hides the state.
7. The customer opens `https://<app>/verificar?token=<one-time>`. The landing screen consumes the
   token, removes it from the address bar (`replaceUrl`) and shows one of: verifying, verified,
   invalid/expired, or missing token.
8. The customer logs in through `/ingresar` (no auto-login, see D-02).

## 5. Acceptance criteria

**AC-003-01 — Successful registration**
Given an unused email,
When the visitor submits a valid form,
Then the API returns `201` with the exact message `Cuenta creada. Te enviamos un correo de verificación, revisa tu bandeja.`,
And a user row exists with an Argon2id hash (never the plain password),
And a verification email is queued/sent.

**AC-003-02 — Password policy**
Given the password field,
Then it must be at least 8 characters and include a lowercase letter, an uppercase letter, a number and a symbol (backend `@IsStrongPassword`),
And the local validation mirrors the API rules and lists every missing rule in Spanish before submitting
(`Debe incluir al menos una minúscula`, `... una mayúscula`, `... un número`, `... un símbolo (ej. ! # $)`).

**AC-003-03 — Email normalization**
Given an email with surrounding spaces or mixed case (`  Maria@Gmail.com `),
Then it is stored and compared in canonical form (`maria@gmail.com`),
And a second registration with a different casing returns `409`.

**AC-003-04 — Duplicate account**
Given an email that already exists,
When the visitor submits,
Then the API returns `409` with `Email is already registered`,
And the UI shows `Ese email ya está registrado. Inicia sesión para continuar.` plus an `Iniciar sesión` link,
And nothing is created.

**AC-003-05 — Validation failures**
Given an empty name, a name shorter than 2 characters, an invalid email, a weak password or mismatched passwords,
Then no request is sent, each field shows its Spanish message, and the first invalid field receives focus.

**AC-003-06 — Verification email**
Given a successful registration,
Then the email contains a single-use link `https://<app>/verificar?token=<token>` valid for 1 hour,
And `POST /api/auth/verify-email` consumes it once and marks the email verified,
And a second use of the same token returns `400` with `Invalid or expired token`.

**AC-003-07 — Resend verification**
Given an unverified account,
When the customer requests another email,
Then `POST /api/auth/resend-verification` returns `200` regardless of whether the email exists,
And the endpoint is limited to 3 requests per minute per client (`429` beyond that),
And the UI disables the action while the request is in flight and shows a 60-second cooldown.

**AC-003-08 — No session before verification**
Given a freshly registered account,
When the customer tries to log in before verifying,
Then the API returns `403` and no session or cookie is created.

**AC-003-09 — Submit state**
Given a request in flight,
Then `Crear cuenta` becomes `Creando cuenta…`, the fields are disabled, and duplicate submits are impossible.

**AC-003-10 — Optional pet type**
Given the `Tu mascota` field,
Then it is a provided select (never free text) with the values `dog`, `cat`, `small_pet` and a `Prefiero no decir` default,
And the chosen value is stored as `User.petType` for catalog personalization,
And leaving it empty sends no `petType` and the account is created normally.

**AC-003-11 — Verification landing**
Given the customer opens `/verificar`,
Then the token is consumed exactly once in the browser (the route is client-rendered, so neither SSR nor prerendering spends it),
And a valid token shows `Tu correo está verificado` with a link to `/ingresar`,
And an invalid, expired or reused token shows `Ese enlace ya no sirve.` with a resend form,
And a URL without a token shows `Este enlace está incompleto.` with a resend form,
And the token is removed from the address bar after the call settles.

## 6. Edge cases and error states

| Trigger | Expected behavior | API |
| --- | --- | --- |
| Name with only spaces | Trimmed; treated as empty; local error | — |
| Password missing a symbol | Local error mirroring the backend rule | — |
| Email delivery fails (Resend) | Registration still succeeds; error logged; UI offers resend | `201` |
| Customer closes the tab after registering | Account exists unverified; resend works from the success panel and `/verificar` | — |
| Expired verification token (over 1 hour) | `400` and a clear "reenviar" path on `/verificar` | `400` |
| Throttled verification request | `429` mapped to `Demasiados intentos. Espera un minuto y vuelve a probar.` | `429` |
| `Tu mascota` left on `Prefiero no decir` | `petType` omitted from the payload; `User.petType` stays `NULL` | `201` |
| Unknown pet value sent by hand | `400` from `@IsIn(['dog','cat','small_pet'])`; never stored as free text | `400` |
| Verification link opened without `?token=` | `Este enlace está incompleto.` + resend form, no API call | — |
| Verification page reloaded after success | Token already consumed; the screen shows the invalid-link state | `400` |
| Unicode/accents in name | Accepted and stored as typed | `201` |

## 7. Non-functional criteria

- `autocomplete="name"`, `autocomplete="email"`, `autocomplete="new-password"` on the fields.
- The password is never echoed back, logged, or stored in the client beyond the form lifetime.
- The success state is announced (`role="status"`); API failures use `role="alert"`.
- The verification token never stays in the address bar and is never sent in a `Referer` header
  (removed with `replaceUrl`; the route is client-rendered).
- No account enumeration through timing or response differences on registration beyond the unavoidable `409`.
- `MAIL_TRANSPORT=log` refuses to start with `NODE_ENV=production` so one-time tokens never reach production logs.

## 8. Out of scope

- Social sign-up.
- Terms and privacy acceptance checkbox (needs legal copy — future story).
- Marketing consent / newsletter opt-in.
- Phone verification.
- Captcha / bot protection (revisit if abuse appears).
- `/restablecer` landing screen (US-004).

## 9. Open product decisions

- **D-02** — Confirm no auto-login after registration (email must be verified first). Implemented this way.
- **D-03** — Resolved: `/verificar?token=` is the verification link and its landing screen; `/restablecer?token=` belongs to US-004.
- **D-04** — Resolved: `Tu mascota` is part of registration as an **optional** provided select
  (`dog` / `cat` / `small_pet`), stored in `User.petType`, used for catalog personalization.
- **D-06** — Still open: register requires 8+complexity, reset requires 12. The register side is
  mirrored client-side; the reset rule needs its own decision in US-004.
- Do we require a terms/privacy checkbox before creating the account?

## 10. Current state and gaps

Implemented end to end and verified against the running API:

- `POST /api/auth/register` → `201` + message, `409` on duplicate (case-insensitive), `400` on a
  weak password or an unknown `petType`; `User.petType` persisted (`NULL` when omitted).
- `POST /api/auth/verify-email` → `200` once, `400 Invalid or expired token` afterwards.
- `POST /api/auth/resend-verification` → `200` always, `429` beyond 3/min.
- The frontend calls the real API through `RegistrationRepositoryPort` → `HttpRegistrationAdapter`
  (`/api` proxied to the NestJS server by the dev server).
- Tests: backend `jest src/modules/auth src/config` (18 suites / 124 tests) and frontend
  `nx test frontend` (5 files / 24 tests) cover the rules above.

Pending / external:

- Real email delivery needs a Resend API key and the two template IDs. Until then the local `.env`
  uses `MAIL_TRANSPORT="log"`, which writes the action link to the backend log.
- The verification link points at `APP_URL` (`https://clior-dev.wanderlee.site` in development) and
  the frontend must be served there for the link to open.
- AC-003-08 cannot be exercised from a browser yet: login is still mocked in the frontend (US-001),
  and a direct local `POST /api/auth/login` answers `500` because the refresh-cookie guard rejects
  an `http` request whose `APP_URL` is `https` (pre-existing deployment-policy issue in US-001, see
  “Known issues” below).
- `/restablecer?token=` (password recovery landing) is not implemented; it belongs to US-004.

Known issues found while verifying (outside US-003):

- Login through a local `http` origin throws
  `Cross-site refresh cookie cannot be issued: APP_URL (https://clior-dev.wanderlee.site) is not same-site with the API origin (http://127.0.0.1:3001)`.
  The Express app does not trust proxy headers, so `request.protocol` stays `http` behind the
  Cloudflare tunnel while `APP_URL` is `https`. US-001 owns the fix (trust the proxy and/or align
  `APP_URL` per environment); the guard itself is deliberate and covered by tests.

## 11. Traceability

| Layer | Path |
| --- | --- |
| Register UI | `apps/frontend/src/app/auth/presentation/views/register.view.ts` |
| Verification landing | `apps/frontend/src/app/auth/presentation/views/verify-email.view.ts` |
| Resend cooldown | `apps/frontend/src/app/auth/presentation/state/resend-cooldown.ts` |
| Domain model | `apps/frontend/src/app/auth/domain/models/auth.model.ts` |
| Registration port | `apps/frontend/src/app/auth/domain/ports/out/registration-repository.port.ts` |
| HTTP adapter | `apps/frontend/src/app/auth/infrastructure/adapters/http-registration.adapter.ts` |
| Error mapping | `apps/frontend/src/app/auth/infrastructure/adapters/auth-error.mapper.ts` |
| Dev proxy | `apps/frontend/proxy.conf.json`, `apps/frontend/project.json` |
| API controller | `apps/backend/src/modules/auth/infrastructure/adapters/in/http/auth.controller.ts` |
| DTO / validation | `apps/backend/src/modules/auth/infrastructure/adapters/in/http/auth.dto.ts` |
| Use case | `apps/backend/src/modules/auth/application/use-cases/register-user.use-case.ts` |
| Email links | `apps/backend/src/modules/auth/infrastructure/adapters/out/email/email-links.ts` |
| Email adapters | `resend-email.adapter.ts`, `log-email.adapter.ts` |
| Persistence | `apps/backend/prisma/models/user.prisma`, migration `20261113152757_add_user_pet_type` |
| Tests | `auth.dto.spec.ts`, `auth.controller.spec.ts`, `email-auth.use-cases.spec.ts`, `log-email.adapter.spec.ts`, `register.view.spec.ts`, `verify-email.view.spec.ts`, `http-registration.adapter.spec.ts`, `auth-error.mapper.spec.ts` |
| Roadmap | P1-4, P1-5, P1-7, P3-1, P3-3, P3-4, P3-6 |
