# 📜 Reglas del Proyecto AJDREW

## Principios generales
- **SOLID**: diseño orientado a objetos limpio y extensible.
- **DRY** (Don't Repeat Yourself): evita duplicar lógica, crea helpers o servicios compartidos.
- **KISS** (Keep It Simple, Stupid): empieza simple, escala después.
- **Separation of Concerns**: cada módulo o feature debe tener una sola responsabilidad.

## Buenas prácticas de código
- **Backend**: nada de lógica en controllers; toda la lógica vive en services.
- **Frontend**: nada de lógica en componentes; toda la lógica vive en hooks o servicios.
- **Tipos y DTOs** en `packages/shared` siempre que sean usados por frontend y backend.
- **Commit messages**: usar Conventional Commits (`feat:`, `fix:`, `chore:`, etc).
- **Ramas**: cada feature en su rama (`feature/calificaciones`, `feature/votaciones`).
- **Tests**: cada fase debe ser testeada antes de empezar la siguiente.

## Estilo
- Código en inglés, comentarios en español si es necesario.
- Uso de ESLint + Prettier en frontend y backend.
