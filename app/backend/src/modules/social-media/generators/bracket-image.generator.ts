import sharp from 'sharp';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type RondaNombre =
  | 'Dieciseisavos'
  | 'Octavos'
  | 'Cuartos'
  | 'Semifinal'
  | 'Final';

export type ImagenTipo = 'apertura' | 'resultado';

export interface CartaParticipante {
  id: string;
  nombre: string;          // Nombre de la carta/personaje
  juego: string;           // Nombre del juego
  imagenUrl?: string;      // URL de la imagen de la carta (Cloudinary)
  imagenBuffer?: Buffer;   // O buffer directo
  votos?: number;
  porcentaje?: number;     // 0-100
  esGanador?: boolean;
}

export interface BracketMatchImageOptions {
  tipo: ImagenTipo;        // 'apertura' | 'resultado'
  ronda: RondaNombre;
  torneoNombre: string;    // ej: "Torneo Clash Royale #3"
  cartaA: CartaParticipante;
  cartaB: CartaParticipante;
  horasCierre?: number;    // Solo para apertura: "Cierra en X horas"
  theme?: BracketTheme;
}

export interface BracketTheme {
  bg: string;
  bgCard: string;
  bgCardDark: string;
  accent: string;
  accentGlow: string;
  textPrimary: string;
  textSecondary: string;
  ganadorColor: string;
  perdedorOpacity: string;
}

// ─── Temas AJDREW (Basados en globals.css) ────────────────────────────────────

export const AJDREW_THEME_GREEN: BracketTheme = {
  bg:              '#001100', // --color-background
  bgCard:          '#152015', // --color-card
  bgCardDark:      '#0a110a', // Oscuro manual
  accent:          '#067506', // --color-primary
  accentGlow:      '#4caf50', // --color-primary-light
  textPrimary:     '#e0f0e0', // --color-text
  textSecondary:   '#90a090', // --color-text-secondary
  ganadorColor:    '#ffd700', // Gold standard
  perdedorOpacity: '0.35',
};

export const AJDREW_THEME_PLATA: BracketTheme = {
  bg:              '#1e1e1e', // --color-background (plata)
  bgCard:          '#252525', // --color-card (plata)
  bgCardDark:      '#181818', // Oscuro manual
  accent:          '#c0c0c0', // --color-primary (plata)
  accentGlow:      '#d8d8d8', // --color-primary-light (plata)
  textPrimary:     '#e0e0e0', // --color-text (plata)
  textSecondary:   '#a0a0a0', // --color-text-secondary (plata)
  ganadorColor:    '#ffd700',
  perdedorOpacity: '0.35',
};

// ─── Constantes de layout ─────────────────────────────────────────────────────

const W = 1080;
const H = 1080;
const CARD_W = 380;
const CARD_H = 560;
const CARD_IMG_H = 380;
const CARD_Y = 160;
const CARD_A_X = 60;
const CARD_B_X = W - CARD_W - 60;
const VS_X = W / 2;
const VS_Y = H / 2 - 30;

// ─── Helper: porcentaje → ancho de barra ─────────────────────────────────────

const barWidth = (pct: number, maxW: number) =>
  Math.round((Math.min(pct, 100) / 100) * maxW);

// ─── Helper: número de votos formateado ──────────────────────────────────────

const fmtVotos = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

// ─── SVG base ────────────────────────────────────────────────────────────────

function buildMatchSvg(opts: BracketMatchImageOptions, theme: BracketTheme): string {
  const { tipo, ronda, torneoNombre, cartaA, cartaB, horasCierre } = opts;

  const esResultado = tipo === 'resultado';
  
  // Colores por carta según resultado
  const colorA = esResultado
    ? (cartaA.esGanador ? theme.ganadorColor : theme.textSecondary)
    : theme.accentGlow;
  const colorB = esResultado
    ? (cartaB.esGanador ? theme.ganadorColor : theme.textSecondary)
    : theme.accentGlow;

  const opacA = esResultado && !cartaA.esGanador ? theme.perdedorOpacity : '1';
  const opacB = esResultado && !cartaB.esGanador ? theme.perdedorOpacity : '1';

  const pctA = cartaA.porcentaje ?? 50;
  const pctB = cartaB.porcentaje ?? 50;
  const barMaxW = CARD_W - 32;

  const rondaLabel: Record<RondaNombre, string> = {
    Dieciseisavos: '1/16 · DIECISEISAVOS',
    Octavos:       '1/8 · OCTAVOS DE FINAL',
    Cuartos:       '1/4 · CUARTOS DE FINAL',
    Semifinal:     '1/2 · SEMIFINAL',
    Final:         'GRAN FINAL',
  };

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
    xmlns="http://www.w3.org/2000/svg">

  <!-- Fondo -->
  <rect width="${W}" height="${H}" fill="${theme.bg}"/>

  <!-- Líneas decorativas de fondo -->
  <line x1="0" y1="${H/2}" x2="${W}" y2="${H/2}"
        stroke="${theme.accent}" stroke-width="0.5" opacity="0.15"/>
  <line x1="${W/2}" y1="0" x2="${W/2}" y2="${H}"
        stroke="${theme.accent}" stroke-width="0.5" opacity="0.15"/>

  <!-- Borde exterior -->
  <rect x="8" y="8" width="${W-16}" height="${H-16}" rx="16"
        fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.5"/>

  <!-- ── HEADER ── -->
  <rect x="0" y="0" width="${W}" height="130" fill="${theme.bgCardDark}"/>
  <rect x="0" y="128" width="${W}" height="2" fill="${theme.accent}" opacity="0.6"/>

  <!-- Logo Placeholder -->
  <rect x="24" y="24" width="80" height="80" rx="12"
        fill="${theme.accent}" opacity="0.2"/>
  <text x="64" y="76" text-anchor="middle"
        font-family="sans-serif" font-size="32" font-weight="bold"
        fill="${theme.accentGlow}">A</text>

  <!-- Nombre torneo -->
  <text x="120" y="58"
        font-family="sans-serif" font-size="13" letter-spacing="3"
        fill="${theme.accentGlow}">AJDREW</text>
  <text x="120" y="84"
        font-family="sans-serif" font-size="20" font-weight="bold"
        fill="${theme.textPrimary}">${torneoNombre}</text>
  <text x="120" y="108"
        font-family="monospace" font-size="13" letter-spacing="2"
        fill="${theme.accent}">${rondaLabel[ronda]}</text>

  <!-- Tipo badge -->
  <rect x="${W - 220}" y="36" width="196" height="56" rx="10"
        fill="${esResultado ? '#ffd70022' : theme.accent + '22'}"
        stroke="${esResultado ? '#ffd700' : theme.accent}" stroke-width="1"/>
  <text x="${W - 122}" y="60" text-anchor="middle"
        font-family="monospace" font-size="11" letter-spacing="2"
        fill="${esResultado ? '#ffd700' : theme.accentGlow}">
    ${esResultado ? 'RESULTADO FINAL' : 'VOTACION ABIERTA'}
  </text>
  <text x="${W - 122}" y="82" text-anchor="middle"
        font-family="monospace" font-size="13" font-weight="bold"
        fill="${esResultado ? '#ffd700' : theme.textPrimary}">
    ${esResultado
      ? (cartaA.esGanador ? cartaA.nombre : cartaB.nombre) + ' GANA'
      : horasCierre
        ? 'Cierra en ' + horasCierre + 'h'
        : 'Vota ahora'}
  </text>

  <!-- ── CARTA A (izquierda) ── -->
  <g opacity="${opacA}">
    <rect x="${CARD_A_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="16"
          fill="${theme.bgCard}"
          stroke="${colorA}" stroke-width="${cartaA.esGanador && esResultado ? '3' : '1'}"/>

    <rect x="${CARD_A_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_IMG_H}" rx="16"
          fill="${theme.bgCardDark}"/>
    <rect x="${CARD_A_X}" y="${CARD_Y + CARD_IMG_H - 16}" width="${CARD_W}" height="16"
          fill="${theme.bgCard}"/>

    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H/2 + 20}"
          text-anchor="middle"
          font-family="sans-serif" font-size="80" font-weight="bold"
          fill="${theme.accent}" opacity="0.3">
      ${cartaA.nombre.charAt(0).toUpperCase()}
    </text>

    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 44}"
          text-anchor="middle"
          font-family="sans-serif" font-size="22" font-weight="bold"
          fill="${colorA}">${cartaA.nombre.slice(0, 16)}</text>

    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 70}"
          text-anchor="middle"
          font-family="sans-serif" font-size="13"
          fill="${theme.textSecondary}">${cartaA.juego}</text>

    ${esResultado ? `
    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 106}"
          text-anchor="middle"
          font-family="monospace" font-size="36" font-weight="bold"
          fill="${colorA}">${pctA}%</text>
    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 128}"
          text-anchor="middle"
          font-family="monospace" font-size="12"
          fill="${theme.textSecondary}">${fmtVotos(cartaA.votos ?? 0)} votos</text>

    <rect x="${CARD_A_X + 16}" y="${CARD_Y + CARD_IMG_H + 136}"
          width="${barMaxW}" height="10" rx="5" fill="#1a1a2a"/>
    <rect x="${CARD_A_X + 16}" y="${CARD_Y + CARD_IMG_H + 136}"
          width="${barWidth(pctA, barMaxW)}" height="10" rx="5"
          fill="${colorA}"/>

    ${cartaA.esGanador ? `
    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y - 16}"
          text-anchor="middle"
          font-family="monospace" font-size="14" letter-spacing="3"
          fill="${theme.ganadorColor}">GANADOR</text>
    <rect x="${CARD_A_X - 2}" y="${CARD_Y - 2}" width="${CARD_W + 4}" height="${CARD_H + 4}" rx="18"
          fill="none" stroke="${theme.ganadorColor}" stroke-width="3" opacity="0.6"/>
    ` : ''}
    ` : `
    <text x="${CARD_A_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 106}"
          text-anchor="middle"
          font-family="monospace" font-size="13"
          fill="${theme.textSecondary}">${fmtVotos(cartaA.votos ?? 0)} votos</text>

    <rect x="${CARD_A_X + 16}" y="${CARD_Y + CARD_IMG_H + 116}"
          width="${barMaxW}" height="8" rx="4" fill="#1a1a2a"/>
    <rect x="${CARD_A_X + 16}" y="${CARD_Y + CARD_IMG_H + 116}"
          width="${barWidth(pctA, barMaxW)}" height="8" rx="4"
          fill="${theme.accent}"/>
    `}
  </g>

  <!-- ── VS CENTRAL ── -->
  <circle cx="${VS_X}" cy="${VS_Y}" r="52" fill="${theme.bgCardDark}"
          stroke="${theme.accent}" stroke-width="1.5"/>
  <text x="${VS_X}" y="${VS_Y + 14}" text-anchor="middle"
        font-family="sans-serif" font-size="28" font-weight="bold"
        fill="${theme.textPrimary}">VS</text>

  <!-- ── CARTA B (derecha) ── -->
  <g opacity="${opacB}">
    <rect x="${CARD_B_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="16"
          fill="${theme.bgCard}"
          stroke="${colorB}" stroke-width="${cartaB.esGanador && esResultado ? '3' : '1'}"/>

    <rect x="${CARD_B_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_IMG_H}" rx="16"
          fill="${theme.bgCardDark}"/>
    <rect x="${CARD_B_X}" y="${CARD_Y + CARD_IMG_H - 16}" width="${CARD_W}" height="16"
          fill="${theme.bgCard}"/>

    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H/2 + 20}"
          text-anchor="middle"
          font-family="sans-serif" font-size="80" font-weight="bold"
          fill="${theme.accent}" opacity="0.3">
      ${cartaB.nombre.charAt(0).toUpperCase()}
    </text>

    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 44}"
          text-anchor="middle"
          font-family="sans-serif" font-size="22" font-weight="bold"
          fill="${colorB}">${cartaB.nombre.slice(0, 16)}</text>

    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 70}"
          text-anchor="middle"
          font-family="sans-serif" font-size="13"
          fill="${theme.textSecondary}">${cartaB.juego}</text>

    ${esResultado ? `
    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 106}"
          text-anchor="middle"
          font-family="monospace" font-size="36" font-weight="bold"
          fill="${colorB}">${pctB}%</text>
    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 128}"
          text-anchor="middle"
          font-family="monospace" font-size="12"
          fill="${theme.textSecondary}">${fmtVotos(cartaB.votos ?? 0)} votos</text>

    <rect x="${CARD_B_X + 16}" y="${CARD_Y + CARD_IMG_H + 136}"
          width="${barMaxW}" height="10" rx="5" fill="#1a1a2a"/>
    <rect x="${CARD_B_X + 16}" y="${CARD_Y + CARD_IMG_H + 136}"
          width="${barWidth(pctB, barMaxW)}" height="10" rx="5"
          fill="${colorB}"/>

    ${cartaB.esGanador ? `
    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y - 16}"
          text-anchor="middle"
          font-family="monospace" font-size="14" letter-spacing="3"
          fill="${theme.ganadorColor}">GANADOR</text>
    <rect x="${CARD_B_X - 2}" y="${CARD_Y - 2}" width="${CARD_W + 4}" height="${CARD_H + 4}" rx="18"
          fill="none" stroke="${theme.ganadorColor}" stroke-width="3" opacity="0.6"/>
    ` : ''}
    ` : `
    <text x="${CARD_B_X + CARD_W/2}" y="${CARD_Y + CARD_IMG_H + 106}"
          text-anchor="middle"
          font-family="monospace" font-size="13"
          fill="${theme.textSecondary}">${fmtVotos(cartaB.votos ?? 0)} votos</text>

    <rect x="${CARD_B_X + 16}" y="${CARD_Y + CARD_IMG_H + 116}"
          width="${barMaxW}" height="8" rx="4" fill="#1a1a2a"/>
    <rect x="${CARD_B_X + 16}" y="${CARD_Y + CARD_IMG_H + 116}"
          width="${barWidth(pctB, barMaxW)}" height="8" rx="4"
          fill="${theme.accent}"/>
    `}
  </g>

  <!-- ── FOOTER ── -->
  <rect x="0" y="${H - 80}" width="${W}" height="80" fill="${theme.bgCardDark}"/>
  <rect x="0" y="${H - 80}" width="${W}" height="1.5"
        fill="${theme.accent}" opacity="0.5"/>

  <text x="${W/2}" y="${H - 46}" text-anchor="middle"
        font-family="sans-serif" font-size="13" letter-spacing="2"
        fill="${theme.accent}">
    ${esResultado ? 'SIGUIENTE RONDA PRONTO · ' : 'VOTA EN · '}ajdrew.site
  </text>
  <text x="${W/2}" y="${H - 22}" text-anchor="middle"
        font-family="sans-serif" font-size="12"
        fill="${theme.textSecondary}">@ajdrew_oficial</text>
</svg>`;
}

export async function generarImagenBracket(
  opts: BracketMatchImageOptions,
): Promise<Buffer> {
  const theme = opts.theme ?? AJDREW_THEME_GREEN;

  const svg = buildMatchSvg(opts, theme);

  let base = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  const composites: sharp.OverlayOptions[] = [];

  if (opts.cartaA.imagenBuffer || opts.cartaA.imagenUrl) {
    const imgA = await fetchImageBuffer(
      opts.cartaA.imagenBuffer,
      opts.cartaA.imagenUrl,
    );
    if (imgA) {
      const resizedA = await sharp(imgA)
        .resize(CARD_W, CARD_IMG_H, { fit: 'cover', position: 'top' })
        .png()
        .toBuffer();

      composites.push({
        input: resizedA,
        top: CARD_Y,
        left: CARD_A_X,
        blend: opts.cartaA.esGanador === false ? 'dest-atop' : 'over',
      });
    }
  }

  if (opts.cartaB.imagenBuffer || opts.cartaB.imagenUrl) {
    const imgB = await fetchImageBuffer(
      opts.cartaB.imagenBuffer,
      opts.cartaB.imagenUrl,
    );
    if (imgB) {
      const resizedB = await sharp(imgB)
        .resize(CARD_W, CARD_IMG_H, { fit: 'cover', position: 'top' })
        .png()
        .toBuffer();

      composites.push({
        input: resizedB,
        top: CARD_Y,
        left: CARD_B_X,
        blend: opts.cartaB.esGanador === false ? 'dest-atop' : 'over',
      });
    }
  }

  if (composites.length > 0) {
    base = await sharp(base).composite(composites).png().toBuffer();
  }

  if (opts.tipo === 'resultado') {
    const perdedorOverlays: sharp.OverlayOptions[] = [];

    if (opts.cartaA.esGanador === false) {
      const overlay = await sharp({
        create: {
          width: CARD_W,
          height: CARD_H,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0.65 },
        },
      }).png().toBuffer();

      perdedorOverlays.push({ input: overlay, top: CARD_Y, left: CARD_A_X });
    }

    if (opts.cartaB.esGanador === false) {
      const overlay = await sharp({
        create: {
          width: CARD_W,
          height: CARD_H,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0.65 },
        },
      }).png().toBuffer();

      perdedorOverlays.push({ input: overlay, top: CARD_Y, left: CARD_B_X });
    }

    if (perdedorOverlays.length > 0) {
      base = await sharp(base).composite(perdedorOverlays).png().toBuffer();
    }
  }

  return base;
}

async function fetchImageBuffer(
  buffer?: Buffer,
  url?: string,
): Promise<Buffer | null> {
  if (buffer) return buffer;
  if (!url) return null;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}
