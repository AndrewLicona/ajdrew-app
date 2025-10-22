# 🚀 Fases del Proyecto AJDREW

Este roadmap define la evolución del proyecto paso a paso.  
Cada fase incluye **objetivos**, **entregables** y **dependencias**.

---

## ✅ Fase 1: Calificaciones (MVP inicial)

### Objetivo
Permitir a los usuarios **calificar ítems** (ej: jugadores, cartas, etc.) y mostrar un **ranking** en tiempo real.

### Backend
- Crear módulos:
  - `Categoria` (activar/desactivar, tipo = calificar).
  - `ItemCalificable` (ítems dentro de la categoría).
  - `Calificacion` (puntuación individual por ítem).
- Guardar cada calificación con IP/token para evitar duplicados.
- Ranking calculado dinámicamente por categoría.
- Endpoints protegidos para admin (CRUD completo).

### Frontend
- Página `/calificaciones` con listado de categorías e ítems.
- UI de calificación con estrellas o slider.
- Vista de ranking en tiempo real.
- Panel de admin con login JWT y CRUD de ítems.

### Entregables
- DB inicial con categorías, ítems y calificaciones.
- API REST funcional.
- UI pública para calificar + UI admin simple.

---

## 🔄 Fase 2: Votaciones (torneos por rondas)

### Objetivo
Crear **torneos de votación por rondas** (octavos, cuartos, semifinal, final).

### Backend
- Módulo `Votacion` con:
  - `rondaInicial` (ej: 8 ítems → cuartos de final).
  - Estado `activo` para controlar disponibilidad.
  - Relación con `ItemVotacion`.
  - Entidad `Voto` (con IP/token para actualizar).
- Lógica para avanzar rondas automáticamente y guardar ganadores.
- Endpoints admin para activar/desactivar y manejar ítems.

### Frontend
- Página `/votaciones` para usuarios.
- UI que muestre los enfrentamientos y permita votar.
- Ranking dinámico por votación.
- Panel admin para crear torneos, agregar ítems y manejar rondas.

### Entregables
- API que gestione torneos por rondas.
- Interfaz pública de votaciones.
- Panel admin con control de torneos.

---

## 📚 Fase 3: Tutoriales

### Objetivo
Publicar y clasificar tutoriales relacionados con cada juego.

### Backend
- Módulo `Tutorial`.
- Campos: título, descripción, nivel (fácil, medio, difícil), video/enlace.
- Relación con `Juego`.
- Endpoints CRUD protegidos con JWT.

### Frontend
- Página `/tutoriales` con listado filtrado por nivel y juego.
- UI con cards para cada tutorial.
- Admin dashboard para crear/editar tutoriales.

### Entregables
- API CRUD de tutoriales.
- UI pública con filtrado.
- Panel admin para manejo de tutoriales.

---

## 🎮 Fase 4: Juegos

### Objetivo
Organizar calificaciones, votaciones y tutoriales dentro de cada juego.

### Backend
- Módulo `Juego`.
- Relación con categorías, votaciones y tutoriales.
- Endpoint que devuelve toda la info del juego en un solo JSON (para frontend).

### Frontend
- Página `/juegos/[id]` con:
  - Cards de calificaciones.
  - Cards de votaciones.
  - Cards de tutoriales.
- Buscador y filtros.

### Entregables
- API de juegos con agregación de datos.
- Página individual para cada juego.
- Interfaz visual unificada.

---

## 🎁 Fase 5: Extras y mejoras

### Ideas iniciales
- Módulo `Sorteos` (usuarios participan con token).
- Notificaciones (ej: resultados de rondas).
- Panel de estadísticas (uso, calificaciones más votadas, etc).
- SEO avanzado para `/juegos` y `/tutoriales`.

### Entregables
- Funcionalidades adicionales bajo demanda.
- Documentación en `99-roadmap.md` con backlog de ideas.

---

# 📌 Dependencias

- **Fase 1** es la base → sin calificaciones no hay categorías ni ítems.
- **Fase 2** depende de categorías/ítems creados en fase 1.
- **Fase 3** y **Fase 4** pueden hacerse en paralelo si la base está lista.
- **Fase 5** son extras opcionales.
