# 🏗️ Arquitectura del Proyecto AJDREW

Este documento define la arquitectura **backend + frontend** del proyecto AJDREW.
Debe ser seguida **estrictamente** por desarrolladores y por la IA para garantizar consistencia.

---

## 🔑 Principios generales

1. **SOLID** → cada clase/módulo debe tener una sola responsabilidad, dependencias claras y abstraídas.
2. **DRY (Don't Repeat Yourself)** → no duplicar lógica, si se repite se extrae a servicio/helper.
3. **KISS (Keep It Simple, Stupid)** → soluciones simples, escalables, sin sobreingeniería.
4. **Separation of Concerns** → Backend maneja lógica y persistencia, Frontend se encarga de UI/UX.
5. **Clean Code** → nombres claros, funciones pequeñas, tipado fuerte con TypeScript.

---

## ⚙️ Monorepo

El proyecto se organiza como **monorepo** usando **pnpm workspaces**:

```
/apps
  ├── backend   # API NestJS
  └── frontend  # Frontend Next.js

/packages
  └── shared    # Tipos, DTOs y utilidades comunes
```

Ejemplo de `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 🗂️ Arquitectura Backend (ejemplo: módulo `calificaciones`)

### Estructura de carpetas

```
calificaciones/
│── domain/                      # Capa de dominio (reglas de negocio puras)
│   │── entities/
│   │   ├── calificacion.entity.ts
│   │   └── item-calificable.entity.ts
│   │── value-objects/           # (opcional) ej. RatingValue, UniqueId
│   └── services/                # (opcional) lógica de dominio puro
│
│── application/                 # Casos de uso (orquestación de reglas de negocio)
│   │── calificar.service.ts     # Servicio principal de orquestación
│   │── use-cases/
│   │   ├── create-calificacion.usecase.ts
│   │   ├── update-calificacion.usecase.ts
│   │   └── get-ranking.usecase.ts
│   └── dto/                     # Contratos de entrada/salida
│       ├── create-calificacion.dto.ts
│       ├── update-calificacion.dto.ts
│       └── ranking.dto.ts
│
│── infrastructure/              # Adaptadores a frameworks externos
│   │── persistence/
│   │   ├── calificacion.repository.ts
│   │   └── item-calificable.repository.ts
│   │── mappers/                 # transformadores DB ↔ domain entities
│   └── prisma/orm.config.ts     # Configuración Prisma / TypeORM
│
│── interfaces/                  # Interfaces con el mundo exterior
│   ├── calificar.controller.ts  # HTTP endpoints (NestJS REST)
│   ├── graphql.resolver.ts      # (opcional) si usas GraphQL
│   └── rest-docs.ts             # (opcional) Swagger/OpenAPI docs
│
└── calificaciones.module.ts     # Ensambla todo en un módulo NestJS
```

---

## 📌 Descripción por capa

* **Domain**:
  Entidades, value objects y servicios puros.
  Sin dependencias de NestJS, DB ni frameworks externos.

* **Application**:
  Casos de uso → representan acciones que la app ofrece (crear calificación, obtener ranking, etc).
  Orquestan entidades, repositorios y validaciones.
  Incluye DTOs como contratos de entrada/salida.

* **Infrastructure**:
  Adaptadores concretos (repositorios con Prisma/TypeORM, mappers, configuración).
  Aquí vive todo lo que depende de un framework o tecnología externa.

* **Interfaces**:
  Puntos de entrada/salida con el mundo exterior: controladores HTTP, resolvers GraphQL, documentación Swagger.

* **Módulo NestJS**:
  Archivo que ensambla dependencias (`.module.ts`) y expone el módulo al resto de la app.


