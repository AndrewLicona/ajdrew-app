# AJDREW - Gaming Hub & Social Automation Platform

AJDREW es una plataforma integral de gestión de contenidos de videojuegos, calificaciones, rankings, torneos de votación (brackets), sorteos interactivos y automatización de publicaciones en redes sociales.

## 🚀 Características Principales

1. **Gestión de Torneos y Votaciones (Brackets)**:
   - Creación de enfrentamientos eliminatorios (VS).
   - Generación automática de imágenes dinámicas para rondas y campeones.
   - Avance de fases y eventos automáticos.

2. **Calificaciones y Rankings**:
   - Tablas de puntuación para juegos y elementos calificables.
   - Cálculo de promedios en tiempo real.
   - Generación de gráficos de ranking en formato de imagen/video.

3. **Sorteos Interactivos con Ruleta**:
   - Creación de sorteos con selección de premios y fechas límite.
   - Animación interactiva de ruleta (Framer Motion) para el sorteo de ganadores.
   - Modo manual y automático de selección de ganadores.

4. **Automatización de Redes Sociales**:
   - **Cloudinary**: Almacenamiento exclusivo en la nube para todas las imágenes generadas (sorteos, tutoriales, rankings, brackets).
   - **Discord**: Publicación de embeds ricos a través de Webhooks.
   - **Meta (Facebook e Instagram)**: Publicación automática de anuncios, tutoriales y resultados mediante Graph API.
   - **YouTube**: Conversión automática de imágenes estáticas a videos Shorts mediante `fluent-ffmpeg` y subida automatizada con OAuth2 y autorefrito de tokens.
   - **X (Twitter)**: Publicación de actualizaciones y anuncios en formato de tweets con multimedia.

5. **Panel de Administración Avanzado**:
   - Gestión completa de cuentas conectadas.
   - Botón de edición rápida de tokens de acceso (ej. Facebook Page Access Tokens) sin requerir re-creación de registros.
   - Pruebas de integración en tiempo real.

## 🛠️ Stack Tecnológico

- **Backend**: NestJS, Prisma ORM, PostgreSQL, Fluent-FFmpeg, Cloudinary SDK.
- **Frontend**: Next.js 14/15, Tailwind CSS, Framer Motion, Lucide React, SweetAlert2.
- **Contenerización**: Docker & Docker Compose para despliegue en producción.

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Code <noreply@anthropic.com>
