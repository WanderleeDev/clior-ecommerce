# Backend (NestJS)

E-commerce backend built with NestJS 11, following a hexagonal (ports & adapters) architecture.

## Requirements

- Node.js >= 20
- pnpm (workspace root)

## Architecture

```
src/
└── products/
    ├── domain/                  # Framework-free domain layer
    │   └── product.ts           # Product, ProductRepositoryPort, ProductNotFoundError
    ├── application/             # Use cases (orchestration layer)
    │   └── products.use-cases.ts
    ├── infrastructure/          # Adapters (port implementations)
    │   └── in-memory-product.repository.ts
    ├── interface/               # Interface adapters (Nest controllers + DTOs)
    │   ├── product.controller.ts
    │   └── product.dto.ts
    ├── products.module.ts
    └── product.controller.spec.ts
```

Layers:
- **domain** — entities, value objects, ports (interfaces), domain errors. No Nest imports.
- **application** — use cases. Depends only on domain. Nest `@Injectable()` so DI works.
- **infrastructure** — port adapters (e.g. in-memory, will be Prisma later).
- **interface** — HTTP controllers, request/response DTOs, Swagger decorators.

## API docs (Swagger)

Swagger UI is served at `/api/docs`. The OpenAPI spec is at `/api/docs-json`.

Built with `@nestjs/swagger` v11 (CJS-compatible with Jest).

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Get product by id (404 if not found) |

## Run

```bash
cd apps/backend
pnpm run start:dev
```

API: `http://localhost:3000`
Swagger UI: `http://localhost:3000/api/docs`

## Test

```bash
cd apps/backend
pnpm test
```

## Build

```bash
cd apps/backend
pnpm run build
pnpm run start:prod
```

## Environment

Validated at boot by `src/config/env.validation.ts`; the process refuses to start with a
missing or malformed value.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `DATABASE_URL` | — (required) | PostgreSQL connection string |
| `JWT_SECRET` | — (required) | Access-token signing secret, 32+ characters |
| `JWT_EXPIRES_IN` | `3600` | Access-token lifetime in seconds |
| `RESEND_API_KEY` | — (required) | Resend API key |
| `RESEND_VERIFICATION_TEMPLATE_ID` | — (required) | Resend template for the verification email |
| `RESEND_PASSWORD_RESET_TEMPLATE_ID` | — (required) | Resend template for the password reset email |
| `MAIL_FROM` | `Clio <onboarding@resend.dev>` | Sender presented by the email provider |
| `APP_URL` | `http://localhost:4200` | Frontend origin used to build the links inside emails |
| `MAIL_TRANSPORT` | `resend` | `resend` delivers real email; `log` writes the action link to the application log for local development and refuses `NODE_ENV=production` |
