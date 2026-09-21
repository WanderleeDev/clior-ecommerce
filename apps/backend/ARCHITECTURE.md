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
    ├── <feature>/             # vertical slices (products, orders, users, ...)
    │   ├── domain/             # entities, value objects, errors, outbound ports
    │   ├── application/        # use cases and application services
    │   ├── infrastructure/     # Prisma and other outbound adapters
    │   ├── interface/          # controllers, DTOs, transport mapping
    │   └── <feature>.module.ts # adapter bindings
    ├── infrastructure/        # shared technical adapters (Prisma lifecycle)
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
src/<feature>/
├── domain/events/              # business event contracts and payloads
├── application/                # use cases publish events through a port
├── infrastructure/events/      # Nest EventEmitter adapter/subscribers
└── <feature>.module.ts         # event handlers and adapter bindings
```

Event handlers must be idempotent and should not hide required transactional work. If an operation must succeed or fail atomically with the aggregate update, keep it in the use case and transaction. Use events for decoupled reactions such as notifications, search indexing, or analytics.

## Database model

PostgreSQL is the persistence adapter. Prisma 7.10 is used with `@prisma/adapter-pg`; the generated client is emitted under `src/generated/prisma` and is accessed through `PrismaService`.

| Table | Responsibility | Main relationships |
|---|---|---|
| `users` | Customer identity and account data | Has `addresses`, `orders`, `reviews` |
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
| Domain model and outbound port | `src/products/domain/product.ts` |
| Application use cases | `src/products/application/products.use-cases.ts` |
| HTTP adapter and DTO | `src/products/interface/` |
| PostgreSQL adapter | `src/products/infrastructure/prisma-product.repository.ts` |
| Test adapter | `src/products/infrastructure/in-memory-product.repository.ts` |
| Port binding | `src/products/products.module.ts` |

NestJS dependency injection is used only at the composition boundary. A port is represented by a TypeScript interface and a stable token (for example, `PRODUCT_REPOSITORY_PORT`). A use case injects the token; it must not import `PrismaService` directly.

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
| `@nestjs/passport` + `passport-jwt` | HTTP authentication strategy | Installed | Keep guards and strategies in the interface/infrastructure boundary; map the authenticated principal into an application input. |
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
