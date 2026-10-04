/**
 * Templates por defecto para todas las plataformas y tipos de evento.
 *
 * Convención de placeholders:
 *  - {{titulo}}           → título del recurso
 *  - {{premio}}           → premio del sorteo
 *  - {{fechaFin}}         → fecha de cierre del sorteo
 *  - {{url}}              → URL pública del recurso
 *  - {{tematica}}         → nombre del bracket/votación
 *  - {{juego.nombre}}     → nombre del juego
 *  - {{juego.image}}      → imagen del juego
 *  - {{descripcion}}      → descripción del recurso
 *  - {{autor}}            → autor del tutorial
 *  - {{ganadores}}        → lista de ganadores formateada
 *  - {{premioItem}}       → nombre del item destacado
 *  - {{#if image}}...{{/if}} → bloque condicional
 *
 * Plataformas soportadas:
 *  - discord
 *  - x
 *  - meta (facebook + instagram)
 *  - youtube
 */
export interface DefaultTemplate {
  tipo: string;
  plataforma: string;
  template: string;
}

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  // ─── SORTEOS ─────────────────────────────────────────────────────────
  {
    tipo: 'sorteo_created',
    plataforma: 'discord',
    template: `🎁 **¡NUEVO SORTEO!**

**{{titulo}}**

🎮 Premio: {{premio}}
📅 Termina: {{fechaFin}}
{{#if juego.nombre}}🎯 Juego: {{juego.nombre}}{{/if}}

👉 Participa aquí: {{url}}

#sorteo #gaming #ajdrew`,
  },
  {
    tipo: 'sorteo_created',
    plataforma: 'x',
    template: `🎁 ¡NUEVO SORTEO en AJDREW!

{{titulo}}
🎮 Premio: {{premio}}
📅 Termina {{fechaFin}}
{{#if juego.nombre}}🎯 {{juego.nombre}}{{/if}}

👉 {{url | truncate:280}}

#gaming #sorteo`,
  },
  {
    tipo: 'sorteo_created',
    plataforma: 'meta',
    template: `🎁 ¡NUEVO SORTEO!

{{titulo}}

🎮 Premio: {{premio}}
📅 Termina: {{fechaFin}}

👉 Participa en el link de nuestra bio.

#gaming #sorteo #giveaway`,
  },
  {
    tipo: 'sorteo_created',
    plataforma: 'youtube',
    template: `¡NUEVO SORTEO! - {{titulo}}

Participa por {{premio}} en AJDREW.

🎮 {{juego.nombre}}
📅 Termina {{fechaFin}}

👉 {{url}}`,
  },

  // ─── SORTEOS - GANADORES ─────────────────────────────────────────────
  {
    tipo: 'sorteo_winners',
    plataforma: 'discord',
    template: `🏆 **¡TENEMOS GANADORES!**

**{{titulo}}**

🎉 Ganadores: {{ganadores}}
🎮 Premio: {{premio}}

¡Felicidades! 🎊 Sigan conectados para más sorteos.

👉 {{url}}`,
  },
  {
    tipo: 'sorteo_winners',
    plataforma: 'x',
    template: `🏆 ¡TENEMOS GANADORES!

**{{titulo}}**

🎉 {{ganadores}}
🎮 Premio: {{premio}}

¡Felicidades! 🎊

👉 {{url | truncate:280}}`,
  },
  {
    tipo: 'sorteo_winners',
    plataforma: 'meta',
    template: `🏆 ¡TENEMOS GANADORES!

**{{titulo}}**

🎉 Ganadores: {{ganadores}}
🎮 Premio: {{premio}}

¡Felicidades! 🎊`,
  },

  // ─── TUTORIALES ──────────────────────────────────────────────────────
  {
    tipo: 'tutorial_published',
    plataforma: 'discord',
    template: `📚 **¡Nuevo tutorial!**

**{{titulo}}**

{{#if descripcion}}{{descripcion}}{{/if}}
{{#if autor}}✍️ Por: {{autor}}{{/if}}
{{#if juego.nombre}}🎮 {{juego.nombre}}{{/if}}

👉 {{url}}

#tutorial #gaming #ajdrew`,
  },
  {
    tipo: 'tutorial_published',
    plataforma: 'x',
    template: `📚 Nuevo tutorial en AJDREW!

"{{titulo}}"
{{#if juego.nombre}}🎮 {{juego.nombre}}{{/if}}

👉 {{url | truncate:280}}

#gaming #tutorial #pro`,
  },
  {
    tipo: 'tutorial_published',
    plataforma: 'meta',
    template: `📚 Nuevo tutorial en AJDREW!

"{{titulo}}"

{{#if descripcion}}{{descripcion}}{{/if}}

👉 Link en la bio.

#tutorial #gaming`,
  },

  // ─── BRACKETS / VOTACIONES ───────────────────────────────────────────
  {
    tipo: 'bracket_created',
    plataforma: 'discord',
    template: `🔥 **¡NUEVA VOTACIÓN!**

**{{tematica}}**

¡Vota por tu favorito! Cada voto cuenta.

👉 {{url}}

#torneo #gaming #bracket`,
  },
  {
    tipo: 'bracket_created',
    plataforma: 'x',
    template: `🔥 ¡Nuevo bracket en AJDREW!

{{tematica}}

¡Vota por tu favorito! 👉 {{url | truncate:280}}

#gaming #torneo`,
  },
  {
    tipo: 'bracket_created',
    plataforma: 'meta',
    template: `🔥 ¡NUEVA VOTACIÓN!

{{tematica}}

¡Vota por tu favorito! Link en la bio.

#torneo #gaming`,
  },

  // ─── BRACKETS - FASE ─────────────────────────────────────────────────
  {
    tipo: 'bracket_phase',
    plataforma: 'discord',
    template: `⚔️ **RONDA {{ronda}} - {{tematica}}**

Los enfrentamientos están listos. ¡Vota ya!

👉 {{url}}`,
  },
  {
    tipo: 'bracket_phase',
    plataforma: 'x',
    template: `⚔️ RONDA {{ronda}} - {{tematica}}

¡Vota ya! 👉 {{url | truncate:280}}

#torneo #gaming`,
  },

  // ─── BRACKETS - CAMPEÓN ──────────────────────────────────────────────
  {
    tipo: 'bracket_champion',
    plataforma: 'discord',
    template: `👑 **¡TENEMOS CAMPEÓN!**

🏆 **{{premioItem}}** es el ganador de **{{tematica}}**

¡Felicidades al campeón y a todos los participantes! 🎉

👉 {{url}}`,
  },
  {
    tipo: 'bracket_champion',
    plataforma: 'x',
    template: `👑 ¡TENEMOS CAMPEÓN!

🏆 {{premioItem}} gana {{tematica}}

¡Felicidades! 🎉

👉 {{url | truncate:280}}`,
  },
  {
    tipo: 'bracket_champion',
    plataforma: 'meta',
    template: `👑 ¡TENEMOS CAMPEÓN!

🏆 {{premioItem}} gana {{tematica}}

¡Felicidades! 🎉`,
  },

  // ─── TABLAS DE RANKING ───────────────────────────────────────────────
  {
    tipo: 'tabla_created',
    plataforma: 'discord',
    template: `📊 **¡NUEVO RANKING!**

**{{titulo}}**
{{#if juego.nombre}}🎮 {{juego.nombre}}{{/if}}

Vota por tus favoritos y define el top.

👉 {{url}}`,
  },
  {
    tipo: 'tabla_created',
    plataforma: 'x',
    template: `📊 Nuevo ranking en AJDREW!

{{titulo}}
{{#if juego.nombre}}🎮 {{juego.nombre}}{{/if}}

Vota por tus favoritos 👉 {{url | truncate:280}}`,
  },

  // ─── RANKING UPDATED (snapshot del top) ─────────────────────────────
  {
    tipo: 'ranking_updated',
    plataforma: 'discord',
    template: `📊 **TOP ACTUALIZADO - {{titulo}}**

{{#if juego.nombre}}🎮 {{juego.nombre}}{{/if}}

¡El ranking cambió! Descubre quién está en el #1.

👉 {{url}}`,
  },
  {
    tipo: 'ranking_updated',
    plataforma: 'x',
    template: `📊 TOP ACTUALIZADO - {{titulo}}

¡El ranking cambió! 👉 {{url | truncate:280}}`,
  },
];

/**
 * Tipos de eventos soportados.
 * Útil para validar en el controller y mostrar opciones en el frontend.
 */
export const SUPPORTED_EVENT_TYPES = [
  'sorteo_created',
  'sorteo_winners',
  'tutorial_published',
  'bracket_created',
  'bracket_phase',
  'bracket_champion',
  'tabla_created',
  'ranking_updated',
] as const;

export const SUPPORTED_PLATFORMS = [
  'discord',
  'x',
  'meta',
  'youtube',
] as const;