# User Stories Catalog — Clior Pets

> Last updated: 2026-11-16
> Companions: `ROADMAP.md`, `docs/user-histories/README.md`, `docs/db-schema-erd.html`
> Purpose: identify the most common e-commerce stories **before** implementation, so each one can enter the story-branch flow (one story = one branch, mini-tasks in worktrees) with a clear Gate 0.

This catalog is the backlog index. Full product intent per story lives in `docs/user-histories/US-<nnn>-<slug>.md` (template in that folder's README). IDs are stable and never reused; US-001..US-004 are already written.

---

## 1. Existing stories (auth)

| ID | Story | Route | Priority | Story status | Impl. status |
| --- | --- | --- | --- | --- | --- |
| [US-001](user-histories/US-001-login.md) | Iniciar sesión | `/ingresar` | Must | Ready | Mock |
| [US-002](user-histories/US-002-logout.md) | Cerrar sesión | `/cuenta` (action) | Must | Ready | Mock |
| [US-003](user-histories/US-003-register.md) | Registrarse | `/registro`, `/verificar?token=` | Must | Done | Real |
| [US-004](user-histories/US-004-password-recovery.md) | Recuperar acceso | `/recuperar`, `/restablecer?token=` | Must | Draft | Mock |

---

## 2. Common stories to write next

Priority: **Must** = buying funnel, **Should** = account self-service, **Could** = later value.
Impl. status: `Mock` (UI only) · `Partial` · `Real` · `Missing` (no UI yet).

### Buying funnel (Must)

| ID | Story | As a… I want… so that… | Routes | Roadmap | Impl. | Depends on |
| --- | --- | --- | --- | --- | --- | --- |
| US-005 | Explorar el catálogo | customer, browse products with filters, sort and pagination, find what my pet needs quickly | `/catalogo` | P2-1..P2-4, P2-7, P2-8 | Mock | US-018 (foundation), P0 |
| US-006 | Ver detalle de producto | customer, see photos, price, stock and description of one product, decide to buy with confidence | `/producto/:id` | P2-2, P2-9 | Mock | US-005 |
| US-007 | Explorar marcas | customer, browse the brand directory and jump to its products, trust the brands I know | `/marcas` | P2-1, P2-5 | Mock | US-018 |
| US-008 | Gestionar mi carrito | customer, add/remove products and change quantities with live totals, prepare my purchase | `/carrito`, navbar badge | P4-1..P4-5 | Mock | US-006, D1 (client cart) |
| US-009 | Finalizar mi compra (checkout) | logged-in customer, choose a shipping address and confirm my order, receive my products at home | `/checkout`, `/pedido/confirmado` | P4-6..P4-9 | Missing | US-001, US-008, US-013 |
| US-010 | Pagar mi pedido | customer, pay securely with a Peruvian payment method, complete my purchase | `/checkout` (payment step) | P5-1..P5-3 | Missing | US-009, D4 (provider) |
| US-011 | Ver mis pedidos | logged-in customer, see my order history and each order's status, know when my package arrives | `/cuenta/pedidos`, `/cuenta/pedidos/:id` | P6-2 | Mock | US-009 |

### Account self-service (Should)

| ID | Story | As a… I want… so that… | Routes | Roadmap | Impl. | Depends on |
| --- | --- | --- | --- | --- | --- | --- |
| US-012 | Gestionar mi perfil | logged-in customer, view/edit my name and change my password, keep my account up to date and secure | `/cuenta/perfil` | P6-1 | Mock | US-001 |
| US-013 | Gestionar mis direcciones | logged-in customer, save, edit and default shipping addresses, check out faster next time | `/cuenta/direcciones` | P4-7, P6-3 | Missing | US-001 |
| US-014 | Reseñar productos | customer with a verified purchase, read and write product reviews, help other pet owners decide | `/producto/:id` (reviews) | P7-1..P7-3, D5 | Mock | US-006, US-009 |

### Backoffice (Should, after customer flows)

| ID | Story | As a… I want… so that… | Routes | Roadmap | Impl. | Depends on |
| --- | --- | --- | --- | --- | --- | --- |
| US-015 | Administrar productos | admin, create/edit products, stock and images, keep the catalog accurate | `/admin/productos` | P8-1..P8-3, D6 | Missing | US-005, roles guard |
| US-016 | Administrar pedidos | admin, filter orders and move their status, fulfill and track shipments | `/admin/pedidos` | P8-4 | Missing | US-009 |
| US-017 | Administrar usuarios | admin, list users and change roles, support customers safely | `/admin/usuarios` | P8-6 | Missing | US-001 |

### Supporting (Could)

| ID | Story | As a… I want… so that… | Routes | Roadmap | Impl. | Depends on |
| --- | --- | --- | --- | --- | --- | --- |
| US-019 | Contactar a soporte | visitor, send a question through the contact form, get help before buying | `/contacto` | — (not in roadmap yet) | Mock | mail transport (D-10) |

### Enabler (not a customer story)

| ID | Item | What | Roadmap | Blocks |
| --- | --- | --- | --- | --- |
| US-018 | Fundación HTTP front↔back | environments + `API_BASE_URL`, interceptors (bearer, single-flight refresh, error normalization), `AuthSessionService`, HTTP adapter binding switch | P1-1..P1-7 | every `Real` story |

US-018 is tracked as an enabler, not a user story: it enters the flow as prerequisite mini-tasks (mf0) of whichever story hits Gate 0 first, or as its own technical branch if the team prefers.

---

## 3. Recommended order

Matches `ROADMAP.md` §9. Each row is one story branch cut from `dev`.

1. **US-001 + US-002** — login/logout real (needs US-018 foundation; fixes D-11 proxy/TLS cookie issue).
2. **US-004** — password recovery landing `/restablecer?token=` (backend already done).
3. **US-005 → US-006 → US-007** — catalog end-to-end (UI exists, only data wiring + DTO gap).
4. **US-008** — real cart (decide D1 first; recommendation: client-side).
5. **US-013 → US-009** — addresses then checkout (orders module is new backend work).
6. **US-010** — payments (decide D4 first).
7. **US-011, US-012** — order history and profile.
8. **US-014** — reviews (decide D5 first).
9. **US-015 → US-016 → US-017** — admin.
10. **US-019** — contact submit, anytime after mail transport exists.

US-003 is in progress on `pr/19-registration-email-verification`; finish and merge it before cutting new auth branches.

---

## 4. Gate 0 baseline (applies to every story)

Per the story-branch-flow skill, no sequential work starts until Gate 0 passes. Shared prerequisites today:

| Prerequisite | State | Owner task |
| --- | --- | --- |
| Backend boots locally (`.env`, Prisma client generated, Postgres up, migrations + seed) | **Missing** | P0-1..P0-3 → mf0 |
| Green baseline recorded (backend test+build, frontend test+build+lint) | **Missing** | P0-4 → mf0 |
| HTTP foundation (environments, interceptors, session service) | **Missing** | US-018 / P1 |
| Story doc written (`docs/user-histories/US-<nnn>-<slug>.md`, status Ready) | Only US-001..004 | per story |
| Blocking product decision resolved (D1 cart, D4 payments, D5 reviews, D6 admin) | Open | per story |

Story-specific Gate 0 items are listed in each story doc's Preconditions section once written.

---

## 5. How this catalog feeds the story-branch flow

1. Pick the next story from §3; write/complete its doc in `docs/user-histories/` until it meets the Definition of Ready.
2. Run Gate 0 (§4 + story preconditions). Missing items become **mf0** mini-tasks first.
3. Cut `us-NNN-<slug>` from `dev`; create the feature doc `odd/tasks/us-NNN-<slug>.md` (Specs/Tasks/Log).
4. Split into mini-tasks that never touch each other's files; one worktree + `us-NNN/mfN-<slug>` branch each.
5. Merge verified-green worktrees back into the story branch; close the story only with every AC covered and the full suite green; merge to `dev` and clean up.

Product intent (this catalog + `docs/user-histories/`) and execution records (`odd/tasks/`) are separate: the former says *what and why*, the latter says *how it was built and verified*.