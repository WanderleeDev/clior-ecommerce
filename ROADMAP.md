# Clior E-commerce — Design Context & Delivery Roadmap

> Last updated: 2026-11-09
> Companions: `apps/backend/ARCHITECTURE.md`, `docs/db-schema-erd.html`, `apps/backend/docs/**`
> Status legend: `[x]` done · `[ ]` pending · `[~]` in progress · `[!]` blocked

This document is the working plan to take the project from a **UI prototype wired to mocks** to a **working commerce application**. It also records the design system and the architectural rules that new work must preserve.

Update this file as tasks land. Keep task IDs stable.

---

## 1. Product context

- **Brand**: Clior Pets — pet e-commerce for dogs, cats and small pets.
- **Market**: Peru. Currency **PEN**, formatted as `S/` with `CurrencyPipe: 'PEN' : 'S/ ' : '1.2-2'`.
- **Voice**: warm, playful, second person (`tu peludo`, `tu mascota`), Spanish (Peru). Benefit-led copy, not corporate.
- **Commercial hooks already in the UI**: free shipping from `S/ 99`, 24/48h shipping, 15-day returns, `puntos Huella`, verified brands.
- **Primary funnel**: Home → Catalog → Product detail → Cart → Checkout → Confirmation → Account / Orders.

### Current routes

| Route | Page | Data source today |
|---|---|---|
| `/` | Home (10 sections) | local mocks / Unsplash |
| `/catalogo` | Product list + filters | `MockProductAdapter` |
| `/producto/:id` | Product detail | `MockProductAdapter` |
| `/marcas` | Brand directory | hardcoded array |
| `/carrito` | Cart | hardcoded 3 lines |
| `/ayuda` | Help / FAQ | static |
| `/blog` | Blog list | `BLOG_POSTS` constant |
| `/contacto` | Contact | static form, no submit |
| `/ingresar` | Login | `MockAuthAdapter` |
| `/registro` | Register | `MockAuthAdapter` |
| `/recuperar` | Forgot password | `MockAuthAdapter` |
| `/cuenta` | Account | mock session, hardcoded orders |

Missing routes: email verification, password reset with token, checkout, order confirmation, order history/detail, address book, profile edit, admin, real 404.

---

## 2. Stack and architecture

- **Monorepo**: Nx 22 + pnpm workspaces. Apps: `frontend` (Angular 21), `backend` (NestJS 11), `frontend-e2e` (Playwright).
- **Frontend**: standalone components, `ChangeDetectionStrategy.OnPush`, signals, `@ngrx/signals` stores, SSR with prerender.
- **Frontend architecture**: feature-sliced hexagonal per feature:
  `domain/` (models + ports) → `application/` (use cases, view models) → `infrastructure/adapters/` (mock/HTTP) → `presentation/` (views, components, state, guards).
- **Backend**: hexagonal (ports & adapters) inside NestJS: `domain/`, `application/` (use cases + ports), `infrastructure/adapters/in|out`, composition root in the feature module.
- **Persistence**: PostgreSQL 16 + Prisma 7.10 (`@prisma/adapter-pg`), schema split in `prisma/models/*.prisma`.
- **Auth contract**: Argon2id passwords; access JWT returned in the body; refresh token as an `httpOnly` cookie named `refresh_token`, path `/api/auth`; login/refresh return `{ accessToken, user }` with `user = { id, email, name, role }`.
- **API base**: `/api/*`; Swagger at `/api/docs`; CORS origin from `APP_URL` with credentials enabled.

---

## 3. Design system (must preserve)

### 3.1 Theme tokens

Defined in `apps/frontend/src/themes.css` and exposed to Tailwind 4 in `src/styles.css` via `@theme`.

| Token | Light | Dark | Mascotas | Usage |
|---|---|---|---|---|
| `--background` | `#ffffff` | `#041210` | `#fff8ef` | page background |
| `--surface` | `#f4f5f3` | `#072320` | `#f7ecd9` | cards, inputs, secondary blocks |
| `--foreground` | `#101812` | `#f2f7f5` | `#2b1d10` | primary text |
| `--muted` | `#5b6660` | `#9db3ac` | `#8a6f52` | secondary text |
| `--line` | `rgba(16,24,18,.12)` | `rgba(242,247,245,.12)` | `rgba(43,29,16,.14)` | borders/dividers |
| `--accent` | `#0e9f8a` | `#3bbfad` | `#0e9f8a` | CTAs, links, active state |
| `--accent-ink` | `#ffffff` | `#041210` | `#ffffff` | text on accent |
| `--brand-deep` | `#072320` | `#020807` | `#3d2c17` | footer / dark panels |
| `--star` | `#e8a33d` | `#e8a33d` | `#e8a33d` | ratings |

**Rules**
- Never hardcode colors in components. Use `bg-background`, `text-foreground`, `text-muted`, `border-line`, `bg-surface`, `bg-accent`, `text-accent-ink`, `bg-brand-deep`.
- Every new screen must be reviewed in **all four themes** (`system`, `light`, `dark`, `mascotas`). `mascotas` is a warm cream theme, not a dark variant.
- The theme is class-based. `src/index.html` has the anti-flash inline script and the critters trick; do not remove them.
- Theme-dependent UI must wait for hydration (`ThemeSelectService.isHydrated()`), as `ThemeSelect` does.

### 3.2 Typography and layout

- Display: **Raleway** 600/700/800 (`font-display`). Body: **Roboto** 400/500 (`font-body`). Loaded from Google Fonts in `src/index.html`.
- Page shell: `<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">`.
- Cards: `rounded-2xl border border-line bg-surface`; hero/auth panels use `rounded-3xl`.
- CTAs: pills (`rounded-full`); primary `bg-accent text-accent-ink`; secondary `border border-line`.
- Dense grid: `grid gap-5 sm:grid-cols-2 xl:grid-cols-4` (catalog).
- Sticky sidebars: `lg:sticky lg:top-24`.
- Navbar is fixed, floating pill, blurred backdrop; `main` has `pt-16` in `app.html`.
- Motion: subtle (`marquee`, `hero-float`); all animations collapse under `prefers-reduced-motion`.

### 3.3 Shared components (reuse, don't reinvent)

| Component | Path | Purpose |
|---|---|---|
| `SectionTag` | `shared/components/section-tag.ts` | small accent-dot eyebrow label |
| `CtaButton` | `shared/components/cta-button.ts` | primary/secondary pill link + arrow |
| `Dialogue` | `shared/components/dialogue.ts` | dog↔human Q&A blocks used across home |
| `Faq` | `shared/components/faq.ts` | accordion-style questions |
| `UiCarousel` | `shared/components/ui-carousel.ts` | hero/product carousel |
| `ContactForm` | `shared/components/contact-form.ts` | contact fields (no submit yet) |
| `AuthShell` | `auth/presentation/components/auth-shell.ts` | split auth layout with image |
| `ProductCard` | `products/presentation/components/product-card` | catalog card |
| `ProductGallery`, `ProductInfo`, `ProductPurchase`, `ProductReviews` | `products/presentation/components/*` | product detail |
| `ProductRail` | `products/presentation/components/product-rail` | horizontal product strip |
| `ShopFilters` | `products/presentation/components/shop-filters` | catalog filters |
| `BrandCard` | `products/presentation/components/brand-card` | brand tile |
| `Navbar`, `Footer`, `MobileCta`, `CookieBanner`, `HelpModal`, `ThemeSelect` | `layout/*` | app chrome |

**Interaction conventions**
- Hover on secondary controls: `hover:border-accent hover:text-accent`.
- Focus is global: `:focus-visible { outline: 2px dashed var(--accent); }`. Do not remove it.
- Active nav link: `text-accent font-bold`.
- Every icon-only control needs `aria-label`.
- Icons come from `ngx-iconify-stack` with an offline subset (`src/ngx-iconify/icon-subset.ts`). Adding an icon requires running the generator, not an ad-hoc import.

### 3.4 Media and content

- Local assets in `apps/frontend/public/*.png`; editorial imagery from Unsplash in `products/infrastructure/images.data.ts` with `w`/`q`/`auto=format` params.
- Product photography: the curated 120-product catalog lives in `data/IMAGE-CATALOG.md`, grouped by storefront category and brand (43 brands, `Clior` included). 4 slots per product (`front`, `angle`, `detail`, `lifestyle`), 1024×1024 WebP. Generated files go to `data/images/` (gitignored) and later to `public/` or object storage (D7).
- Product images have an `imageAlt`; keep it descriptive (accessibility + SEO).
- Blog content is static in `blog/blog-data.adapter.ts`; help content is static.
- Currency: always `PEN`/`S/`.
- Copy is Spanish (Peru). Identifiers, comments, commits and infrastructure docs stay in English.

### 3.5 SSR rules

- `app.routes.server.ts` currently prerenders every route and server-renders `producto/:id`.
- **Do not** fetch authenticated data during prerender. When `/cuenta/**`, `/checkout` or any protected route is added, switch it to `RenderMode.Server` (or client-only) and keep public pages prerendered.
- Browser-only APIs (`localStorage`, `window`) must be guarded for SSR (see the cart store task).

---

## 4. Verified current state

### Backend

- **Done**: full auth (register, login, refresh, logout, me, verify-email, resend-verification, forgot-password, reset-password) with Argon2id, rotating opaque refresh sessions, one-time hashed tokens, Resend templates, throttling, roles guard, global exception filter, Swagger.
- **Done**: products — cursor-paginated list with filters/sort, get by id, admin create/update/delete/stock. Prisma repository + in-memory adapter.
- **Done**: health liveness.
- **Schema**: 13 models, including brands, addresses, orders, order items, order/payment statuses, payments, reviews. Migrations + Faker seed (1,000 products).
- **Missing modules**: categories/brands read API, addresses, orders, payments, reviews, profile update, admin users/orders.
- **Contract gap**: `ProductDto` exposes only `id, name, description, priceCents, imageUrl, createdAt` — no `stock`, `categoryId`, `brandId` or names.
- **Known legacy**: `Product.brand String?` coexists with `Product.brandRef`/`brandId`.
- **Brand list drift**: the seed defines 42 brands including the house brand `Clior` but omitting `Hill's`; `mock-product.adapter.ts` `BRANDS` and `brand-list.view.ts` `BRAND_NAMES` define 42 including `Hill's` but omitting `Clior`. The union is 43. `/marcas` now lists `Clior`; the seed still needs `Hill's` when it is rewritten (P2-9).

### Frontend

- **Done**: full visual layer — home, catalog, product detail, brands, cart, help, blog, contact, account, auth views, layout, themes, icons, SSR.
- **Mock-only**: `app.config.ts` binds `MockProductAdapter` and `MockAuthAdapter`; there is no `HttpClient`, no environments, no interceptors.
- **Auth**: `AuthStore` starts with a hardcoded `MOCK_SESSION`, so `authGuard` always passes.
- **Cart**: hardcoded 3 lines; quantity buttons are decorative; checkout CTA loops to the cart.
- **Account**: hardcoded "3 pedidos · 1 en camino".
- **Contact form**: no submit handler.
- **Model mismatch**: frontend `Product` (`price`, `image`, `rating`, `category` string, `oldPrice`) vs backend DTO (`priceCents`, `imageUrl`, `categoryId`).
- **Tests**: `app.spec.ts` only (2 tests); e2e only the generated `example.spec.ts`.

### Infrastructure and verification

- `apps/backend/.env` is missing, and `src/generated/prisma` is gitignored and not generated → 4 backend suites fail to compile.
- Frontend `nx test frontend` passes; app compiles.
- Local host port `3000` is occupied by Dokploy; the backend default must move (e.g. `3001`).
- Dev tunnel `clior-front-dev` maps `clior-dev.wanderlee.site` → `localhost:4200`; ERD served separately.
- **Not started**: backend server (blocked by `.env` + Prisma client).

---

## 5. Target integration architecture

### 5.1 HTTP layer

```
environment(s) → API_BASE_URL token
      ↓
provideHttpClient(withFetch(), withInterceptors([
  apiBaseUrlInterceptor,
  authTokenInterceptor,     // Bearer from in-memory signal
  refreshOn401Interceptor,  // single-flight POST /api/auth/refresh
  errorNormalizationInterceptor
]))
      ↓
HttpProductAdapter / HttpAuthAdapter / HttpOrderAdapter ...
      ↓
existing domain ports (ProductRepositoryPort, AuthRepositoryPort, ...)
```

Rules:
- `withCredentials: true` is required for the `refresh_token` cookie.
- Access token lives **in memory only** (signal), never in `localStorage`.
- On app bootstrap, attempt `/api/auth/refresh`; if it succeeds, hydrate the session.
- Refresh must be single-flight: concurrent 401s share one refresh promise.
- Errors map to domain errors, then to Spanish user messages at the presentation boundary.
- Keep mocks available for unit tests and offline demos behind a provider switch.

### 5.2 Contract mapping

| Backend | Frontend today | Action |
|---|---|---|
| `priceCents: number` | `price: number` | map `/100` in the adapter/use case |
| `imageUrl?: string` | `image: string`, `imageAlt: string` | map with fallback + alt from name |
| `categoryId`, `brandId` | `category: string`, `brand: string` | expose names in DTO or resolve via lookup |
| `stock` | `stock?`, hardcoded "12 und." | wire to real stock |
| `createdAt` | `oldPrice?`, `rating`, `reviews` | decide: marketing fields vs computed aggregates |
| `user { id, email, name, role }` | `user { id, name, email, pet, memberSince }` | map; decide `pet` (schema change) and derive `memberSince` from `createdAt` |

### 5.3 Cross-site cookies (tunnel / production)

If front and API are on different hostnames, the refresh cookie becomes cross-site: `SameSite=None; Secure` (the backend already derives this from `APP_URL` vs API origin, and fails fast in local cross-site HTTP). Set `APP_URL` to the public front origin and expose the API over HTTPS. Prefer same registrable domain (e.g. `app.example.com` + `api.example.com`) to keep cookies `SameSite=Lax`.

---

## 6. Roadmap

### Phase 0 — Unblock local development

- [ ] **P0-1** Create `apps/backend/.env` with `DATABASE_URL`, `JWT_SECRET` (32+ chars), `RESEND_API_KEY`, both template IDs, `APP_URL`, `PORT=3001`. Run `prisma generate`, `docker compose up -d`, `prisma migrate deploy`, `prisma:seed`. **AC**: backend boots, 88 tests green, seed data queryable.
- [ ] **P0-2** Commit `apps/backend/.env.example` (no secrets) and document every variable in the backend README. **AC**: a clean clone can start in < 10 minutes.
- [ ] **P0-3** Resolve the `3000` port conflict (Dokploy) and document `PORT=3001`. **AC**: `start:dev` and Swagger respond on `:3001`.
- [ ] **P0-4** Record a green baseline: backend `test` + `build`, frontend `test` + `build` + `lint`. **AC**: commands and results documented here.

### Phase 1 — Front↔Back foundation

- [ ] **P1-1** Add `src/environments/` and an `API_BASE_URL` injection token (SSR-safe).
- [ ] **P1-2** `provideHttpClient(withFetch(), ...)` + interceptors (base URL, bearer, single-flight refresh, error normalization).
- [ ] **P1-3** `AuthSessionService`: in-memory access token, `login/refresh/logout`, bootstrap refresh, `withCredentials`.
- [ ] **P1-4** Map the backend public user to the frontend `User`; resolve `pet`/`memberSince` (see D2).
- [ ] **P1-5** Domain error types + Spanish messages for 401/403/409/423/429/5xx.
- [ ] **P1-6** Contract tests with `HttpTestingController` for every adapter method.
- [ ] **P1-7** Bind HTTP adapters in `app.config.ts`; keep mocks behind a test/demo switch. **AC**: flipping the switch changes data source with no view changes.

### Phase 2 — Catalog end-to-end

- [ ] **P2-1** Backend `GET /api/categories` and `GET /api/brands` (public, DTOs, tests).
- [ ] **P2-2** Extend `ProductDto` with `stock`, `categoryId`, `brandId`, and resolved `categoryName`/`brandName`. Update Swagger + controller tests.
- [ ] **P2-3** `HttpProductAdapter` implementing `ProductRepositoryPort` (list with cursor, filters, sort; get by id).
- [ ] **P2-4** Catalog pagination ("load more" with `nextCursor`) and filters bound to URL query params.
- [ ] **P2-5** Real brand list on `/marcas`.
- [ ] **P2-6** Decide home data source (D3): API-driven featured/specials vs curated static with real links.
- [ ] **P2-7** Remove `MockProductAdapter` from default providers (keep for tests).
- [ ] **P2-8** Introduce an application view model so API shape never leaks into views.
- [ ] **P2-9** Product images: `ProductImage` model (`url`, `alt`, `slot`, `position`) + migration, `images[]` in `ProductDto`, seed the catalog from `data/IMAGE-CATALOG.md`, and `ViewProductsUseCase` thumbs from the product's own images instead of related products (`application/view-products.use-case.ts:43`). **AC**: detail gallery shows the product's 4 images (`front`, `angle`, `detail`, `lifestyle`); `ProductCard` uses `front`; no related-product images leak into thumbs.
- **AC**: catalog, filters, pagination, detail and brands work against the real backend; loading/empty/error states exist; all 4 themes verified.

### Phase 3 — Auth end-to-end

- [ ] **P3-1** `HttpAuthAdapter` for login/register/forgot/reset/verify/resend/me/logout.
- [ ] **P3-2** Remove `MOCK_SESSION`; hydrate `AuthStore` from the refresh cookie; guard redirects correctly.
- [ ] **P3-3** New pages: `/verificar?token=`, `/restablecer?token=` and their success/error states.
- [ ] **P3-4** Handle 403 unverified email with a resend CTA, plus lockout (423) and throttling (429) messaging.
- [ ] **P3-5** Logout calls the API (clears the cookie) and clears in-memory state.
- [ ] **P3-6** Real user in navbar/account; remove hardcoded "Mariana Torres".
- [ ] **P3-7** Switch `/cuenta` to `RenderMode.Server` and never fetch auth data during prerender.
- **AC**: register → verify email → login → refresh (reload keeps session) → logout works end-to-end against the API.

### Phase 4 — Cart and checkout

- [ ] **P4-1** Decide cart ownership (D1). Recommendation: **client-side cart** for MVP (localStorage + `@ngrx/signals`, SSR-safe).
- [ ] **P4-2** `CartStore`: add/remove/qty/clear, subtotal, item count, persistence, stock limits.
- [ ] **P4-3** Wire `ProductPurchase` (add to cart, real stock, "comprar ahora" → checkout).
- [ ] **P4-4** Real cart page: edit qty, remove, empty state, totals.
- [ ] **P4-5** Cart badge in the navbar.
- [ ] **P4-6** Backend orders module: `POST /api/orders` transaction (validate stock, snapshot `unitPriceCents`, derive total, status `pending`), `GET /api/orders` (own), `GET /api/orders/:id` (own).
- [ ] **P4-7** Backend addresses module: CRUD restricted to the owner; default address rule.
- [ ] **P4-8** Checkout page: address select/create, order summary, payment method placeholder, submit → order.
- [ ] **P4-9** Order confirmation page.
- **AC**: a logged-in user completes checkout; stock decreases; total matches; order appears in history; totals are correct to the cent.

### Phase 5 — Payments

- [ ] **P5-1** Decide provider (D4). For Peru: Culqi or Mercado Pago; Stripe if international.
- [ ] **P5-2** Backend payments module behind a port: create intent/preference, webhook handler, idempotency, status transitions.
- [ ] **P5-3** Checkout integrates the provider; handle success, failure, pending and retry.
- [ ] **P5-4** Admin view for payment status/reconciliation.
- **AC**: a sandbox payment moves the order/payment status correctly and is idempotent under webhook replay.

### Phase 6 — Account area

- [ ] **P6-1** Profile view/edit (name) and change password.
- [ ] **P6-2** Order history + detail with status timeline.
- [ ] **P6-3** Address book CRUD in the UI.
- [ ] **P6-4** "My reviews" (optional).
- **AC**: every account section reads/writes real data and stays inside the authenticated guard.

### Phase 7 — Reviews

- [ ] **P7-1** Backend reviews module: create, list by product (paginated), aggregate rating/count.
- [ ] **P7-2** Product detail: real reviews + form for eligible users (D5: verified purchase or any authenticated user).
- [ ] **P7-3** Rating/count in catalog cards.
- **AC**: aggregates match the stored reviews; one review policy is enforced and tested.

### Phase 8 — Admin / backoffice

- [ ] **P8-1** Decide surface (D6). Recommendation: lazy `/admin` inside the Angular app with `role === 'admin'` guard.
- [ ] **P8-2** Admin layout + guard.
- [ ] **P8-3** Products admin (CRUD, stock, images).
- [ ] **P8-4** Orders admin (filter, status transitions).
- [ ] **P8-5** Categories/brands admin.
- [ ] **P8-6** Users admin (list, role changes).
- **AC**: non-admins get 403/no-access; every admin action is authorized server-side.

### Phase 9 — Quality and delivery

- [ ] **P9-1** Backend e2e suite against a disposable Postgres (auth, products, orders, payments).
- [ ] **P9-2** Frontend unit tests for stores, adapters, guards and error mapping.
- [ ] **P9-3** Playwright e2e: browse → cart → checkout → confirmation (seeded test DB).
- [ ] **P9-4** Accessibility audit: axe, keyboard-only, contrast in all four themes.
- [ ] **P9-5** SEO: per-route title/canonical/OG (replace `example.com`), sitemap, robots.
- [ ] **P9-6** Performance budgets; image optimization; lazy routes.
- [ ] **P9-7** Observability: structured logs, DB readiness check, error tracking.
- [ ] **P9-8** Deployment runbook: build, migrations, env, domain/TLS, backups.
- [ ] **P9-9** Documentation: README, runbook, API examples.

---

## 7. Open decisions

| ID | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Cart ownership | client localStorage vs server cart table | **Client** for MVP; server cart only if cross-device carts are required |
| D2 | `pet` / `memberSince` user fields | add `pet`+meta to schema vs drop from UI | Drop `pet` for MVP; derive `memberSince` from `createdAt` |
| D3 | Home data | hardcoded curated vs API-driven | Keep curated layout, but link tiles to real products/brands |
| D4 | Payment provider | Culqi / Mercado Pago / Stripe / manual | Culqi or Mercado Pago for Peru; manual/COD as fallback |
| D5 | Review eligibility | any authenticated user vs verified purchase | Verified purchase (stronger signal, matches "reseñas" trust copy) |
| D6 | Admin surface | same app `/admin` vs separate app | Same app, lazy, role-guarded |
| D7 | Image storage | DB URL only vs object storage | Object storage (R2/S3) + `imageUrl`; keep seed URLs for dev |
| D8 | Email in dev | real Resend vs console adapter | Console/no-op adapter for tests; Resend only with keys |

---

## 8. Definition of done (every feature)

1. RED test for each new rule before implementation; GREEN after; existing behaviour pinned.
2. Public interface through ports; no Prisma/HTTP types in domain/application.
3. DTO + Swagger updated; controller contract test.
4. Frontend: real adapter, loading/empty/error states, no mock fallback.
5. All four themes verified; keyboard + focus-visible; aria labels on icon controls.
6. SSR-safe: no browser API during prerender; protected routes server/client rendered.
7. Migration + seed update when the schema changes.
8. Docs updated: this file, README/ARCHITECTURE when boundaries change.
9. Verification commands recorded with observed results.

### Verification commands

```bash
# backend
pnpm --filter @clior/backend prisma:generate
pnpm --filter @clior/backend test
pnpm --filter @clior/backend run build

# frontend
npx nx test frontend
npx nx lint frontend
npx nx build frontend

# e2e (once configured)
npx nx e2e frontend-e2e
```

---

## 9. Recommended execution order

1. **Sprint 1 — unblock + foundation**: P0-1..P0-4, P1-1..P1-3.
2. **Sprint 2 — auth real**: P1-4..P1-7, P3-1..P3-7.
3. **Sprint 3 — catalog real**: P2-1..P2-8.
4. **Sprint 4 — cart + checkout**: P4-1..P4-9.
5. **Sprint 5 — payments**: P5-1..P5-4.
6. **Sprint 6 — account + reviews**: P6, P7.
7. **Sprint 7 — admin**: P8.
8. **Sprint 8 — hardening + deploy**: P9.

Rationale: auth first because guards, account and orders depend on it; catalog next because the UI is already built and only needs data; cart/checkout last among the buying flow because it depends on auth + catalog; payments after orders; admin after the customer flows are stable.

---

## 10. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Front/API on different origins | refresh cookie rejected | same registrable domain; else `SameSite=None; Secure` + HTTPS |
| Prisma client not generated | tests/build fail on a fresh clone | P0-1/P0-2, document `prisma:generate` |
| Port 3000 taken by Dokploy | backend won't boot | use `PORT=3001`, document it |
| Prerender fetching auth | build-time failures / empty account | `RenderMode.Server` for protected routes |
| DTO mismatch | silent UI bugs | single mapping layer + contract tests |
| Mock session left in place | false "logged in" state | P3-2 removes `MOCK_SESSION` |
| Missing stock validation | overselling | transactional order creation + stock check |
| Money as floats | rounding errors | keep integer cents everywhere |
| No e2e | regressions in the buying flow | P9-1/P9-3 before release |

---

## 11. File map for new work

```
apps/backend/src/modules/<feature>/
  domain/{models,errors,events}
  application/{ports/in,ports/out,types,use-cases}
  infrastructure/adapters/in/http/{controller,dto}
  infrastructure/adapters/out/persistence/{prisma-*,in-memory-*}
  <feature>.module.ts
  <feature>.controller.spec.ts

apps/frontend/src/app/<feature>/
  domain/{models,ports/in,ports/out,services}
  application/{use-case,view-model}
  infrastructure/adapters/{http-*,mock-*}
  presentation/{views,components,state,guards}
```

Reference implementations to copy: backend `modules/products`, frontend `products` and `auth`.
