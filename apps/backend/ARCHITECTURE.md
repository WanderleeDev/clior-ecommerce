# Backend Architecture

This backend uses **hexagonal architecture (Ports and Adapters)** inside NestJS. The domain and application layers own business rules; NestJS, HTTP, Prisma, PostgreSQL, and external providers are replaceable adapters.

## Current status

The architecture is established for the Products vertical slice. The remaining business areas should follow the same shape as they are implemented. The database schema already models the complete commerce core, but not every table has an application module yet.

## System shape

```text
HTTP request
    ↓
Interface adapter        src/<feature>/interface
    ↓
Application port/use case src/<feature>/application
    ↓
Domain                  src/<feature>/domain
    ↑
Outbound ports           repository/provider interfaces
    ↑
Infrastructure adapters  src/<feature>/infrastructure
    ├── Prisma repositories → Prisma client → PostgreSQL
    ├── In-memory adapters   → unit tests
    └── External providers   → payments, email, etc.
```

The dependency rule points inward:

- **Domain** does not import NestJS, Prisma, HTTP, or infrastructure code.
- **Application** depends on domain types and ports only. It orchestrates use cases and transactions.
- **Interface** translates transport concerns into use-case inputs and outputs.
- **Infrastructure** implements ports and owns persistence, framework integration, and external systems.
- **Composition root** (`src/app.module.ts` and feature modules) binds ports to adapters.

## Repository layout

```text
apps/backend/
├── prisma/
│   ├── schema.prisma          # generator and PostgreSQL datasource
│   ├── models/                # one Prisma model per file
│   ├── migrations/            # committed database history
│   └── seed.ts                # development data
└── src/
    ├── modules/               # business vertical slices
    │   └── <feature>/          # products, orders, users, ...
    │       ├── domain/         # entities, value objects, errors, ports
    │       ├── application/    # use cases and application services
    │       ├── infrastructure/ # feature adapters grouped by direction
    │       │   └── adapters/
    │       │       ├── in/     # HTTP and other driving adapters
    │       │       └── out/    # persistence and external-system adapters
    │       └── <feature>.module.ts
    ├── prisma/                # shared Prisma module and client lifecycle
    ├── config/                # validated environment configuration
    ├── health/                # operational endpoint
    └── app.module.ts           # composition root
```

Keep feature code together. Do not create global `controllers`, `services`, or `repositories` folders that mix unrelated business capabilities.

## Security middleware and application events

The composition root registers cross-cutting infrastructure once:

- `src/main.ts` applies `helmet()` before the application starts serving routes. Helmet adds security-related HTTP headers at the delivery boundary; it does not belong in domain or application code.
- `EventEmitterModule.forRoot()` is registered in `src/app.module.ts`. It provides the runtime event adapter, but feature modules own the event contracts and handlers.

When a feature needs events, keep the event flow inside its vertical slice:

```text
src/modules/<feature>/
├── domain/events/              # business event contracts and payloads
├── application/                # use cases publish events through a port
├── infrastructure/adapters/out/events/ # Nest EventEmitter adapter/subscribers
└── <feature>.module.ts         # event handlers and adapter bindings
```

Event handlers must be idempotent and should not hide required transactional work. If an operation must succeed or fail atomically with the aggregate update, keep it in the use case and transaction. Use events for decoupled reactions such as notifications, search indexing, or analytics.

## Authentication module

Authentication is implemented as a vertical slice under `src/modules/auth/`:

```text
src/modules/auth/
├── domain/
│   ├── models/                        # domain data shapes
│   ├── errors/                        # domain errors, not HTTP exceptions
│   └── events/user-registered.event.ts
├── application/
│   ├── ports/in/                      # use-case contracts for driving adapters
│   ├── ports/out/                     # abstract outbound ports
│   ├── types/                         # application commands/results
│   └── use-cases/                     # lifecycle and authorization use cases
│   ├── listeners/                     # decoupled email/event reactions
├── infrastructure/
│   └── adapters/
│       ├── in/http/                    # HTTP driving adapters
│       │   ├── auth.controller.ts
│       │   ├── auth.dto.ts             # class-validator DTOs
│       │   ├── jwt-auth.guard.ts
│       │   └── jwt.strategy.ts
│       └── out/
│           ├── events/nest-event-bus.adapter.ts
│           ├── persistence/            # users, sessions, and one-time tokens
│           ├── email/resend-email.adapter.ts
│           └── security/                # Argon2, JWT, and opaque-token adapters
└── auth.module.ts                    # composition and port bindings
```

Inbound and outbound ports are abstract classes so Nest can use them as runtime DI tokens without Symbol constants. Interface adapters depend on inbound ports; use cases implement them. Concrete infrastructure adapters extend outbound ports, and application code depends only on those contracts.

The current public endpoints are:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a user and return an access token |
| POST | `/api/auth/login` | Verify credentials and return an access token |
| POST | `/api/auth/refresh` | Rotate a refresh token and issue a new token pair |
| POST | `/api/auth/logout` | Revoke a refresh token |
| GET | `/api/auth/me` | Return the authenticated user from a Bearer token |
| POST | `/api/auth/verify-email` | Consume a one-time email verification token |
| POST | `/api/auth/resend-verification` | Request a verification email without email enumeration |
| POST | `/api/auth/forgot-password` | Request a password reset email without email enumeration |
| POST | `/api/auth/reset-password` | Consume a reset token and replace the password |

Passwords are hashed with Argon2id. Access JWTs contain `sub`, email, and role; refresh tokens are opaque, rotated, revocable, and stored only as SHA-256 hashes. One-time email and reset tokens are also hashed at rest. The API never returns `passwordHash`.

## Database model

PostgreSQL is the persistence adapter. Prisma 7.10 is used with `@prisma/adapter-pg`; the generated client is emitted under `src/generated/prisma` and is accessed through `PrismaService`.

| Table | Responsibility | Main relationships |
|---|---|---|
| `users` | Customer identity and account data | Has `addresses`, `orders`, `reviews` |
| `refresh_sessions` | Rotating refresh-token sessions and revocation state | Belongs to `users`; grouped by token family |
| `auth_tokens` | One-time email-verification and password-reset tokens | Belongs to `users`; expires and is consumed once |
| `addresses` | Customer delivery addresses | Belongs to `users`; referenced by `orders` |
| `categories` | Product classification | Has `products` |
| `products` | Catalog item, price, image, and stock | Optional `category`; has `order_items`, `reviews` |
| `orders` | Purchase aggregate and derived total | Belongs to `users`, `addresses`, and `order_statuses`; has items and an optional payment |
| `order_items` | Product snapshot inside an order | Belongs to `orders` and `products`; freezes `unitPriceCents` |
| `order_statuses` | Portable order-status lookup data | Referenced by `orders.statusId` |
| `payments` | Payment attempt/result for an order | Unique one-to-one with `orders`; references `payment_statuses` |
| `payment_statuses` | Portable payment-status lookup data | Referenced by `payments.statusId` |
| `reviews` | Customer feedback for a product | Belongs to `users` and `products` |

### Persistence invariants

- Monetary values are integers in cents: `priceCents`, `unitPriceCents`, and `Order.total`.
- `OrderItem.unitPriceCents` is a historical snapshot and must not change when the product price changes.
- `Order.total` is derived from `Σ(qty × unitPriceCents)`; order creation/update use cases must preserve this invariant.
- `orders.statusId` and `payments.statusId` reference lookup tables rather than database-native enums. This keeps status data portable across relational databases and allows labels/codes to evolve through data migrations.
- `payments.orderId` is unique, so the current model permits at most one payment per order.
- Prisma relation actions are part of the data contract: user-owned addresses/orders and product reviews cascade on deletion; order addresses and order items' products are protected where historical data must remain valid.

## Ports and adapters by feature

The Products slice is the reference implementation:

| Concern | Current implementation |
|---|---|
| Domain model and outbound port | `src/modules/products/domain/product.ts` |
| Application use cases | `src/modules/products/application/products.use-cases.ts` |
| HTTP adapter and DTO | `src/modules/products/infrastructure/adapters/in/http/` |
| PostgreSQL adapter | `src/modules/products/infrastructure/adapters/out/persistence/prisma-product.repository.ts` |
| Test adapter | `src/modules/products/infrastructure/adapters/out/persistence/in-memory-product.repository.ts` |
| Port binding | `src/modules/products/products.module.ts` |

NestJS dependency injection is used only at the composition boundary. Ports are abstract classes so they remain runtime DI tokens without Symbol constants. A use case depends on ports; it must not import `PrismaService` or a concrete adapter directly.

## Rules for new modules

1. Start from a business capability, not from a database table.
2. Define domain types and outbound ports before choosing an adapter.
3. Put business decisions and invariants in the domain/application layers.
4. Keep Prisma-to-domain mapping inside the Prisma adapter. Never expose Prisma records from a port.
5. Keep controllers thin: validate/translate input, invoke a use case, and map errors to transport responses.
6. Bind one production adapter in the feature module; use in-memory or test doubles in unit tests.
7. Use explicit application transactions for workflows spanning multiple repositories. The transaction mechanism belongs to infrastructure; the use case expresses the business operation.
8. Add migrations for schema changes and update the seed when lookup/reference data changes.

## Testing strategy

- **Domain:** pure unit tests; no NestJS or database.
- **Application:** use in-memory ports to test business rules, error paths, and transaction behavior.
- **Infrastructure:** focused Prisma/PostgreSQL integration tests for mappings, constraints, and migrations.
- **Interface:** controller tests for transport contracts and HTTP error mapping.
- **End-to-end:** verify the composed NestJS application against a disposable PostgreSQL database when the workflow crosses adapters.

## Decisions and boundaries

- NestJS is the delivery/runtime framework, not the domain model.
- Prisma is an outbound adapter, not a repository abstraction exposed to use cases.
- The schema is split into `prisma/models/*.prisma` for maintainability while migrations remain the source of database evolution.
- Lookup tables are preferred over native enums for statuses because the project values database portability and data-driven changes.
- New integrations such as payment gateways, email, storage, or search must be introduced through outbound ports and adapters; they must not leak vendor SDK types into the domain.

## Recommended libraries

Choose libraries by boundary. A library belongs in the outer layer unless it represents a stable business concept that has been deliberately wrapped behind a port.

| Library | Layer / use | Status | Recommendation |
|---|---|---|---|
| `@nestjs/config` | Configuration loading | Installed | Keep environment access in configuration modules; do not read `process.env` throughout the domain or use cases. |
| `zod` | Environment configuration validation | Installed | Use Zod only for parsing and validating environment variables through `ConfigModule`'s `validate` callback. |
| `helmet` | HTTP security headers | Installed | Apply once in `src/main.ts` before the application serves routes. Keep it at the delivery boundary. |
| `@nestjs/event-emitter` | In-process application events | Installed | Register once in `AppModule`; keep event contracts and handlers inside the relevant feature slice. |
| `class-validator` | HTTP DTO validation | Installed | Use with NestJS `ValidationPipe` for request boundaries. It is the preferred DTO validation strategy for this backend because it integrates directly with NestJS. |
| `class-transformer` | HTTP DTO transformation | Installed | Use alongside `class-validator` for typed DTO transformation and controlled coercion. Avoid implicit conversion unless it is explicitly safe. |
| `@nestjs/jwt` | JWT signing and verification | Installed | Use only inside an authentication adapter/service. Expose authentication behavior to application code through a port, not through JWT types. |
| `@nestjs/passport` + `passport-jwt` | HTTP authentication strategy | Installed | Keep guards and strategies in `infrastructure/adapters/in/http`; map the authenticated principal into an application input. |
| `argon2` | Password hashing | Installed | Prefer Argon2id through a password-hasher port. Never hash passwords in controllers or persist plaintext passwords. |
| `@nestjs/swagger` | OpenAPI documentation | Installed | Keep decorators and response DTOs in the interface layer; do not place Swagger decorators on domain entities. |
| `@nestjs/throttler` | Rate limiting | Installed | Add at the HTTP boundary for login, password reset, and other abuse-sensitive endpoints. |
| `nestjs-pino` | Structured logging | Optional | Prefer structured logs for production. Keep logger integration outside the domain and avoid logging credentials, tokens, or payment data. |
| `@nestjs/terminus` | Health and readiness checks | Installed | Use for database and dependency readiness when deployments require more than the current liveness endpoint. |

### Suggested adoption order

1. Add `zod` to the backend and validate environment variables through `ConfigModule` before adding infrastructure configuration.
2. Add `class-validator` and `class-transformer` with a global `ValidationPipe` before adding write endpoints.
3. Add `@nestjs/jwt`, `@nestjs/passport`, and `passport-jwt` when authentication is implemented.
4. Add `argon2` with a password-hasher port before persisting real user credentials.
5. Add throttling and structured logging before exposing the API beyond local development.

Zod is intentionally limited to configuration validation. HTTP DTOs use `class-validator` and `class-transformer` to preserve NestJS pipe, DTO, and Swagger integration.

These are recommendations, not a reason to couple the domain to NestJS. Every framework-specific library must remain replaceable through an adapter or interface boundary.

## Verification checklist

- [ ] The feature has `domain`, `application`, `infrastructure`, and `interface` boundaries where applicable.
- [ ] Domain/application code has no imports from Prisma or concrete infrastructure adapters.
- [ ] Every outbound port has a production adapter and a test double or integration-test strategy.
- [ ] Prisma mappings preserve domain invariants and do not leak persistence records.
- [ ] Schema changes include a migration and compatible seed/reference data.
- [ ] `pnpm --filter @clior/backend test` and `pnpm --filter @clior/backend build` pass before delivery.
