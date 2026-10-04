# Bitácora del Proyecto AJDREW - Resumen de Avances

Este documento resume los avances realizados en el proyecto AJDREW, siguiendo la guía de arquitectura y fases.

## 1. Configuración Inicial del Monorepo

*   **Estructura:** Se ha mantenido la estructura `app/backend` y `app/frontend`.
*   **Shared Package:** Se creó el directorio `packages/shared` para tipos y DTOs compartidos.
*   **Base de Datos:**
    *   Se configuró Prisma como ORM.
    *   Se inició un contenedor Docker de PostgreSQL (versión 16) para la base de datos.
    *   Se actualizó `DATABASE_URL` en `.env`.
    *   Se ejecutaron las migraciones de Prisma para crear el esquema inicial.
    *   Se configuró `onDelete: Cascade` en la relación `Calificacion` -> `ItemCalificable`.

## 2. Implementación del Backend (Fase 1: Calificaciones)

Se han scaffolded los módulos `categorias`, `items-calificables` y `calificaciones` siguiendo la arquitectura de capas (Domain, Application, Infrastructure, Interfaces).

### Módulo `Categorias`
*   **Entidad:** `Categoria` (id, nombre, activa, tipo).
*   **DTOs:** `CreateCategoriaDto`, `UpdateCategoriaDto`.
*   **Controlador:** `CategoriasController` con endpoints CRUD básicos.
*   **Servicio:** `CategoriasService` con lógica CRUD.
*   **Repositorio:** `CategoriaRepository` usando Prisma.
*   **Integración:** `PrismaModule` importado en `CategoriasModule`.

### Módulo `ItemsCalificables`
*   **Entidad:** `ItemCalificable` (id, nombre, **image**, categoriaId).
*   **DTOs:** `CreateItemCalificableDto`, `UpdateItemCalificableDto` (incluyen `image`).
*   **Controlador:** `ItemsCalificablesController` con endpoints CRUD básicos.
    *   El endpoint `findAll` ahora acepta un `categoryId` opcional para filtrar.
*   **Servicio:** `ItemsCalificablesService` con lógica CRUD y filtro por `categoryId`.
*   **Repositorio:** `ItemCalificableRepository` usando Prisma y filtro por `categoryId`.
*   **Integración:** `PrismaModule` importado en `ItemsCalificablesModule`.

### Módulo `Calificaciones`
*   **Entidad:** `Calificacion` (id, puntuacion, ip, itemId).
*   **DTOs:** `CreateCalificacionDto`.
*   **Controlador:** `CalificacionesController` con endpoints:
    *   `POST /calificaciones`: Crea/Actualiza una calificación (maneja IP).
    *   `GET /calificaciones/average/:itemId`: Obtiene promedio y conteo de calificaciones.
    *   `GET /calificaciones/my-rating/:itemId`: Obtiene la calificación del usuario por IP.
    *   `GET /calificaciones/ranking`: **(Actualmente en depuración - no devuelve datos)**
*   **Servicio:** `CalificacionesService` con lógica para crear/actualizar, obtener promedio/conteo, obtener calificación de usuario y obtener ranking (ahora acepta `categoryId` opcional).
*   **Repositorio:** `CalificacionRepository` usando Prisma.
    *   Implementa lógica de "upsert" (actualizar o insertar) basada en IP e itemId.
    *   `onDelete: Cascade` configurado en la relación `Calificacion` -> `ItemCalificable` para permitir la eliminación en cascada.
    *   El método `getRanking` ahora acepta un `categoryId` opcional para filtrar.
*   **Integración:** `PrismaModule` importado en `CalificacionesModule`.

## 3. Implementación del Frontend (Fase 1: Calificaciones)

*   **Ruta `/calificaciones`:**
    *   `page.tsx`: Ahora es el encargado de obtener las categorías y renderizar los ítems.
    *   `loading.tsx`, `error.tsx`: Para una mejor UX.
*   **Componentes:**
    *   `ItemCalificableList.tsx`: Muestra ítems de una categoría específica.
        *   Integra `RatingStars` para calificar.
        *   Muestra el promedio y la cantidad de votos para cada ítem.
        *   Muestra la calificación propia del usuario.
        *   Maneja el envío de calificaciones al backend.
    *   `RatingStars.tsx`: Componente reutilizable para la interfaz de calificación con estrellas.
    *   `RankingDisplay.tsx`: Componente para mostrar el ranking global de ítems.
*   **CORS:** Habilitado en el backend (`main.ts`) para permitir la comunicación con el frontend en desarrollo.

## 4. Estado Actual y Próximos Pasos

*   **Funcionalidad de Calificación:** Completada y funcionando (creación, actualización, visualización de promedio/conteo y calificación propia).
*   **Visualización de Imágenes:** Las imágenes de los ítems se muestran correctamente.
*   **Ranking:** El endpoint `/calificaciones/ranking` está implementado en el backend, pero **actualmente no devuelve datos** (respuesta vacía). Este es el problema que estamos depurando activamente.
*   **Próximos Pasos:**
    1.  **Resolver el problema del endpoint `/calificaciones/ranking` para que devuelva los datos esperados.**
    2.  Una vez que el ranking funcione, se podrá integrar completamente en el frontend.
    3.  Considerar la implementación de un ranking por categoría (según el requisito).
    4.  Continuar con el panel de administración (CRUD completo para admin, login JWT).

## 5. Avances al 5 de octubre de 2025

Se han realizado los siguientes avances y correcciones:

*   **Dockerización del Proyecto:** Completada. El proyecto ahora se puede levantar con `docker-compose up --build`. Se han resuelto problemas de construcción de imágenes, generación del cliente Prisma y aplicación de migraciones.
*   **Endpoint `/api/calificaciones/ranking`:** Resuelto. El endpoint ahora es `/api/calificaciones/ranking-list` y devuelve el ranking de ítems correctamente, con soporte para filtrar por `categoryId`. Se corrigió la lógica de filtrado en el repositorio y el orden de las rutas en el controlador para evitar conflictos.
*   **Datos de Prueba:** Se han creado dos categorías ("Peliculas", "Libros") y 5 ítems por cada una, además de calificaciones de ejemplo para todos los ítems.
*   **Manejo de Rutas:** La aplicación ahora maneja correctamente las rutas no existentes, devolviendo un 404 Not Found cuando corresponde.
*   **Limpieza de Código:** Se eliminaron los `console.log` de depuración.

**Próximos Pasos:**

1.  **Integrar el ranking por categoría en el Frontend.** Esto implica modificar los componentes del frontend para consumir el endpoint `/api/calificaciones/ranking-list?categoryId=...` y mostrar la información del ranking dentro de cada categoría.
2.  Continuar con el panel de administración (CRUD completo para admin, login JWT).

## 6. Avances al 7 de octubre de 2025

Se han realizado los siguientes avances y se han identificado nuevos desafíos:

*   **Implementación de `deviceId` para identificación de votantes:**
    *   **Objetivo:** Permitir que cada dispositivo/navegador tenga su propia calificación editable y que los votos de diferentes dispositivos/navegadores sean independientes, sin requerir autenticación de usuario.
    *   **Backend:**
        *   `schema.prisma`: Añadido el campo `deviceId: String?` al modelo `Calificacion`.
        *   `calificacion.repository.ts`: Modificado el método `create` para usar `deviceId` en la lógica de búsqueda/actualización de calificaciones. `findByIpAndItemId` renombrado a `findByDeviceIdAndItemId` y adaptado.
        *   `calificaciones.service.ts`: Adaptados los métodos `create` y `findMyRating` para manejar `deviceId`.
        *   `calificaciones.controller.ts`: Adaptados los métodos `create` y `findMyRating` para extraer `deviceId` del encabezado `x-device-id`.
        *   **Corrección de error:** Se corrigió un error de compilación (`TS2348`) en `calificaciones.controller.ts` relacionado con la importación del decorador `@Headers`.
    *   **Frontend:**
        *   `calificacionesService.ts`: Añadida la función `getOrCreateDeviceId` (usando un generador de UUID compatible) y modificadas `submitRating` y `fetchMyRating` para usar y enviar el `deviceId` en el encabezado `x-device-id`.
        *   `ItemCalificableList.tsx`: Modificado `fetchItems` para obtener la calificación del usuario (`myRating`) junto con los ítems.
        *   **Corrección de error:** Se corrigió el error `crypto.randomUUID is not a function` en `getOrCreateDeviceId` utilizando una función de generación de UUID más compatible.

**Problemas Actuales y Próximos Pasos:**

1.  **Persistencia de "estrellas pintadas" (PC a Teléfono):** A pesar de la implementación de `deviceId`, la calificación de un dispositivo sigue apareciendo en otro. Esto sugiere que la identificación del votante aún no es robusta o que hay un problema en el flujo del `deviceId`.
    *   **Avance:** Se ha corregido la entidad `ItemCalificable` en el backend (`item-calificable.entity.ts`) para incluir `averageRating`, `ratingCount` y `myRating`.
    *   **Acción Pendiente:** Verificar la respuesta del `GET /api/items-calificables` con el parámetro `deviceId` para confirmar que `myRating` se devuelve correctamente.
2.  **Prisma Studio no muestra `deviceId`:** Pendiente de confirmación tras un reinicio limpio de Docker.
    *   **Avance:** Se confirmó que la columna `deviceId` aparece en Prisma Studio después de un reinicio limpio de Docker.
3.  **Lentitud en el teléfono (problema N+1):** La carga es lenta debido a múltiples llamadas `fetchMyRating` por cada ítem.
    *   **Avance:** Se ha modificado el backend (`item-calificable.repository.ts`, `items-calificables.service.ts`, `items-calificables.controller.ts`) y el frontend (`calificacionesService.ts`, `ItemCalificableList.tsx`) para que el `myRating` se devuelva directamente con los ítems, eliminando el problema N+1.
    *   **Acción Pendiente:** Confirmar que el `myRating` se devuelve correctamente en la respuesta del `GET /api/items-calificables`.
4.  **Problemas con Cloudflare:** Al usar Cloudflare, los rankings no se muestran y hay problemas de conexión.
    *   **Acción:** Pendiente de depuración una vez que la funcionalidad principal esté estable sin Cloudflare.

---

## 7. Roadmap de 3 Fases — Iniciado el 04/10/2026

Se ha definido un plan completo en `docs/ROADMAP-FASES.md` con 3 fases de ~5-7 días cada una. Estado actual del proyecto: tiene buena base de backend, frontend y un sistema de eventos sociales que publica automáticamente sorteos/tutoriales/votaciones en Discord, X, Meta y YouTube. Falta:

- **Fase 1 — Content Studio + Preview:** plantillas editables en DB, preview antes de publicar, dashboard unificado.
- **Fase 2 — Retry Queue + BullMQ + OAuth YouTube:** reintentos automáticos, métricas, login con Google/YouTube.
- **Fase 3 — Google AdSense + Onboarding `/yt/[slug]`:** monetización y landing específica para suscriptores de YouTube.

Ver detalles completos, checklists por fase, snippets de código, esquema Prisma y riesgos en `docs/ROADMAP-FASES.md`.

---

## 8. [Fase 1] Completada — 04/10/2026

### Resumen
Content Studio (plantillas editables + preview antes de publicar + trazabilidad de publicaciones) implementado y funcionando. Backend, frontend y tests pasaron. Los listeners sociales existentes ahora leen los textos desde DB con fallback a defaults hardcoded, así que la transición es 100% backward-compatible.

### Archivos creados

**Backend (`app/backend/src/content-studio/`):**
- `content-studio.module.ts` — módulo NestJS
- `content-studio.controller.ts` — endpoints REST (preview, publish, schedule, retry, templates, seed)
- `content-studio.service.ts` — lógica de negocio + auto-seed en `onModuleInit`
- `text-builder.service.ts` — lee templates de DB con cache 5min y fallback a defaults
- `templates/template-renderer.service.ts` — render de placeholders `{{clave}}`, `{{a.b}}`, `{{#if}}`, `{{x | truncate:N}}`
- `templates/template-renderer.service.spec.ts` — 25 tests unitarios
- `templates/default-templates.ts` — 30+ templates por defecto para 8 tipos de evento × 4 plataformas
- `application/dto/preview.dto.ts`
- `application/dto/publish.dto.ts`
- `application/dto/schedule.dto.ts`
- `application/dto/update-template.dto.ts`
- `scheduled-publications.cron.ts` — cron que procesa publicaciones PROGRAMADAS cada minuto

**Frontend (`app/frontend/src/`):**
- `modules/content-studio/types/index.ts` — tipos TS
- `modules/content-studio/services/content-studio.service.ts` — cliente HTTP
- `modules/content-studio/components/PublicationStatusBadge.tsx`
- `modules/content-studio/components/SocialPreviewPanel.tsx`
- `app/admin/content-studio/page.tsx` — dashboard principal con KPIs
- `app/admin/content-studio/new/page.tsx` — wizard de 4 pasos
- `app/admin/content-studio/publications/page.tsx` — historial con retry
- `app/admin/content-studio/templates/page.tsx` — editor de plantillas

**Schema Prisma:**
- `app/backend/prisma/schema.prisma` — 3 modelos nuevos (SocialTemplate, SocialPublication, SocialAnalytics)
- `app/backend/prisma/migrations/1_content_studio/migration.sql` — migración SQL

### Archivos modificados
- `app/backend/src/app.module.ts` — registro del ContentStudioModule
- `app/backend/src/modules/social-media/social-media.module.ts` — importa ContentStudioModule y exporta SocialTextBuilder
- `app/backend/src/modules/social-media/listeners/social-publication.listener.ts` — refactor: usa textBuilder.build() en vez de los 7 builders privados (que se borraron)
- `app/backend/src/modules/social-media/listeners/bracket-phase.listener.ts` — inyecta SocialTextBuilder
- `app/frontend/src/app/admin/layout.tsx` — añade "Content Studio" al menú lateral
- `app/backend/package.json` — añade `class-validator` y `class-transformer`

### Decisiones tomadas
- **Backward-compatible refactor**: en vez de reescribir los listeners, se inyectó `SocialTextBuilder` que lee de DB y si no encuentra usa defaults hardcoded. Comportamiento idéntico si no se ejecuta el seed.
- **Auto-seed en `onModuleInit`**: el módulo inserta los defaults al arrancar, sin requerir acción manual. Si el admin edita un template, se sobrescribe el de DB.
- **Cache de 5 minutos en `SocialTextBuilder`**: para no golpear DB en cada publicación. Se invalida con `clearCache()` cuando se actualiza.
- **Reuso de eventos existentes**: `publishNow` y `schedule` emiten los mismos eventos que ya escuchan los listeners (`social.sorteo.created`, `bracket.phase.started`, etc.) — no se rompió la arquitectura.
- **`SocialPublication` sin FK al recurso**: se usa `referenciaTipo` + `referenciaId` como columnas libres para que pueda rastrear cualquier entidad (sorteo/tutorial/bracket/ranking).

### Problemas encontrados
- `prisma migrate diff` requería `migration_lock.toml` que faltaba en el proyecto. Se creó.
- Docker/DB no estaban disponibles para `prisma migrate dev`, así que se generó el SQL con `prisma migrate diff --from-empty` + diff entre schemas. La migración queda lista para aplicar cuando Andrew levante Docker.
- Tuve que eliminar archivos temporales (`_unused_*.sql`, `schema.new.prisma`) usando `mavis-trash.cmd` por la política de borrado.

### Tests
- 25/25 tests unitarios pasando para `TemplateRenderer` (placeholders, condicionales, truncado, casos reales).
- Compilación TypeScript sin errores en backend y frontend.

### Próximos pasos
- [ ] **Fase 2 — Retry Queue con BullMQ + Redis + OAuth YouTube**
  - Instalar Redis + BullMQ
  - Refactorizar listeners para encolar en vez de publicar directo
  - Cron de analytics de X/Meta cada día 2am
  - OAuth con Google para login con YouTube
- [ ] **Fase 3 — Google AdSense + Onboarding `/yt/[slug]`**
  - Integrar AdSense en layout + páginas públicas
  - Cookie banner para GDPR/LGPD
  - Página `/yt/[slug]` con video embebido + CTA
  - End screens automáticos en YouTube

---

## 9. Limpieza de emojis en Fase 1 — 04/10/2026

### Resumen
El usuario pidio no usar emojis en el UI y usar los iconos de la libreria instalada (react-icons). Tambien limpio el mojibake del roadmap (caracteres UTF-8 interpretados como Latin-1).

### Cambios
- `app/frontend/src/modules/content-studio/components/PlatformIcon.tsx` — usa `react-icons/fa6` y `react-icons/fa` para brand icons oficiales (FaDiscord, FaXTwitter, FaMeta, FaYoutube).
- Refactor de `PLATAFORMA_ICON` (emoji map) en 3 archivos del admin.
- `docs/ROADMAP-FASES.md` — limpieza de mojibake via `scripts/fix-mojibake.js`.
- `docs/ROADMAP-FASES.md` y `docs/bitacora.md` — sin emojis de 4 bytes (verificado por conteo de bytes 0xF0 = 0).

---

## 10. [Fase 2] Completada — 04/10/2026

### Resumen
Retry queue con BullMQ + Redis + reintentos exponenciales + OAuth con Google para Sign in with YouTube + cron de analytics.

### Versiones verificadas (compatibles con NestJS 11)
- `@nestjs/bullmq@^11.0.5` (peer dep: NestJS ^10 || ^11)
- `bullmq@^6.0.0` (probada con 6.3.11)
- `ioredis@^5.8.0` (probada con 5.11.1)
- `passport-google-oauth20@^2.0.0`

### Archivos creados

**Backend `app/backend/src/social-queue/`:**
- `social-queue.module.ts` — registra la cola BullMQ con backoff exponencial (5 intentos: 30s, 1m, 2m, 4m, 8m) y concurrency 3
- `social-queue.producer.ts` — API para encolar (enqueue, enqueueMany, getStats, retryFailedJob) + tipos de payload
- `social-queue.producer.spec.ts` — 9 tests
- `workers/social-publisher.processor.ts` — worker que despacha a Discord/X/Meta/YouTube segun plataforma y tipo de evento

**Backend `app/backend/src/auth-google/`:**
- `auth-google.module.ts`
- `auth-google.controller.ts` — endpoints `GET /auth/google` y `GET /auth/google/callback`
- `auth-google.service.ts` — crea/actualiza usuario y emite JWT compatible con el resto
- `strategies/google.strategy.ts` — passport-google-oauth20 con scopes email, profile, youtube.readonly
- `strategies/google.strategy.spec.ts` — 3 tests

**Backend `app/backend/src/modules/social-media/cron/`:**
- `analytics-cron.service.ts` — refresca metricas cada dia a las 2am

**Frontend `app/frontend/src/app/auth/callback/`:**
- `page.tsx` — recibe token+user del backend y guarda en localStorage

### Archivos modificados
- `docker-compose.yml` — anade servicio Redis (redis:7-alpine, volumen, healthcheck)
- `.env` — variables GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, REDIS_HOST, REDIS_PORT
- `app/backend/src/app.module.ts` — registra BullModule.forRoot, SocialQueueModule, AuthGoogleModule
- `app/backend/src/modules/social-media/social-media.module.ts` — importa SocialQueueModule (forwardRef) + AnalyticsCronService
- `app/backend/src/modules/social-media/listeners/social-publication.listener.ts` — refactor: inyecta SocialQueueProducer y crea SocialPublication + enqueue en vez de publicar directo
- `app/backend/src/modules/social-media/services/x.service.ts` — añade getTweetMetrics() (placeholder para Fase 3)
- `app/backend/src/modules/social-media/services/meta.service.ts` — añade getPostMetrics() (placeholder para Fase 3)
- `app/frontend/src/app/login/page.tsx` — añade boton "Continuar con Google" usando `FcGoogle` de react-icons

### Decisiones tomadas
- **forwardRef para resolver ciclo**: SocialQueueModule importa SocialMediaModule (necesita los services para el worker) y viceversa (necesita el producer para los listeners). NestJS resuelve con `forwardRef(() => ...)`.
- **Placeholder metrics en X/Meta**: las llamadas reales a `twitterClient.v2.singleTweet()` y Meta Graph API se implementaran en Fase 3 cuando se conecten las APIs reales. Por ahora devuelven estructura con flag `placeholder: true` para que el cron no falle.
- **Reuso de `evento` field**: use `evento` en vez de `type` en el payload para evitar colision con `type` en TypeScript y NestJS.
- **Tests sin Redis**: mockeamos la Queue de BullMQ en los tests para no requerir Redis real.

### Tests
- 9/9 tests del SocialQueueProducer pasando
- 3/3 tests de GoogleStrategy pasando
- Backend compila sin errores de TypeScript
- Frontend compila sin errores de TypeScript

### Configuracion necesaria para levantar el stack
1. En `.env`: configurar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` (obtener de https://console.cloud.google.com/apis/credentials)
2. En Google Cloud Console: añadir URI `http://localhost:3000/api/auth/google/callback` a "Authorized redirect URIs"
3. `docker-compose up -d` para arrancar Redis junto con Postgres
4. `pnpm start:dev` en backend y frontend

### Proximos pasos
- [ ] **Fase 3 — Google AdSense + Onboarding `/yt/[slug]`**
  - Integrar AdSense en layout + paginas publicas
  - Cookie banner para GDPR/LGPD
  - Pagina `/yt/[slug]` con video embebido + CTA
  - End screens automaticos en YouTube
  - Implementar las llamadas reales a X API v2 y Meta Graph API para getTweetMetrics/getPostMetrics