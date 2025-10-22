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