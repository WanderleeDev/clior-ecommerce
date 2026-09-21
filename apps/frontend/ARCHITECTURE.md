# Arquitectura Hexagonal + Screaming Architecture en Angular
Idea general
Screaming Architecture: el primer nivel bajo app/ grita el dominio del negocio (products, orders, customers, payments), no capas técnicas (components, services, models).
Hexagonal (puertos y adaptadores): dentro de cada dominio, el domain es el núcleo (no depende de nada), y application, infrastructure y presentation son las capas que orquestan y adaptan hacia afuera.
Regla de dependencia: presentation e infrastructure dependen de domain. domain no depende de nadie.


src/
└── app/
    ├── core/                              # Config transversal (NO es un dominio)
    │   ├── config/
    │   ├── interceptors/
    │   └── guards/
    │
    ├── shared/                            # Reutilizable, sin identidad propia
    │   ├── components/                    # botones, inputs, modales, spinners...
    │   ├── utils/
    │   └── pipes/
    │
    ├── layout/                            # Shell de la app (única instancia, estructural)
    │   ├── navbar/
    │   ├── footer/
    │   ├── cookie-banner/
    │   └── mobile-cta/
    │
    ├── products/                          # 👈 GRITA el dominio: "Productos"
    │   ├── domain/                        # Núcleo (hexágono central)
    │   │   ├── models/
    │   │   │   └── product.model.ts       # entidad rica, con invariantes de negocio
    │   │   ├── ports/                     # Interfaces (contratos)
    │   │   │   ├── in/
    │   │   │   │   └── view-products.usecase.ts
    │   │   │   └── out/
    │   │   │       └── product-repository.port.ts
    │   │   └── services/
    │   │       └── product-domain.service.ts
    │   │
    │   ├── application/                   # Casos de uso — orquesta el dominio
    │   │   ├── view-products.use-case.ts  # implementa el puerto "in"
    │   │   └── product-view.model.ts      # ProductView: ViewModel plano para la UI
    │   │
    │   ├── infrastructure/                # Adaptadores secundarios (driven)
    │   │   ├── adapters/
    │   │   │   └── http-product.adapter.ts    # implementa el puerto "out"
    │   │   └── mappers/                   # 👈 SOLO si DTO ≠ domain model
    │   │       └── product.mapper.ts
    │   │
    │   └── presentation/                  # Adaptadores primarios (driving / UI)
    │       ├── views/                     # pantallas/rutas
    │       │   ├── product-detail/
    │       │   │   ├── product-detail.view.ts
    │       │   │   └── product-detail.view.html
    │       │   └── product-list/
    │       ├── components/                # componentes propios del dominio
    │       │   └── product-card/
    │       └── state/                     # opcional: signals/store
    │           └── product.store.ts
    │
    ├── customers/                         # 👈 mismo esqueleto que products
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── presentation/
    │
    └── payments/                          # 👈 mismo esqueleto que products
        ├── domain/
        ├── application/
        ├── infrastructure/
        └── presentation/