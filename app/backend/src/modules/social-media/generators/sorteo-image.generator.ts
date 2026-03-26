import sharp from 'sharp';
import axios from 'axios';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface SorteoImageData {
  titulo: string;
  premio: string;
  fechaFin: Date;
  imagenUrl?: string; // URL de la imagen del premio (Cloudinary)
  imagenBuffer?: Buffer; // O buffer directo
  juegoNombre?: string;
}

export interface SorteoTheme {
  bg: string;
  bgCard: string;
  bgCardDark: string;
  accent: string;
  accentGlow: string;
  textPrimary: string;
  textSecondary: string;
  premioColor: string;
}

// ─── Temas AJDREW ─────────────────────────────────────────────────────────────

export const AJDREW_THEME_SORTEO: SorteoTheme = {
  bg: '#001100', // --color-background
  bgCard: '#152015', // --color-card
  bgCardDark: '#0a110a',
  accent: '#067506', // --color-primary
  accentGlow: '#4caf50', // --color-primary-light
  textPrimary: '#e0f0e0',
  textSecondary: '#90a090',
  premioColor: '#ffd700', // Gold para premio
};

// ─── Constantes de layout ─────────────────────────────────────────────────────

const W = 1080;
const H = 1080;
const CARD_W = 800;
const CARD_H = 700;
const CARD_Y = 200;
const CARD_X = (W - CARD_W) / 2;
const IMG_SIZE = 320;

// ─── Helper: formatear fecha ──────────────────────────────────────────────────

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Capitalizar primera letra del mes
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day} ${monthCapitalized} ${year} · ${hours}:${minutes}`;
}

// ─── Helper: escape XML ───────────────────────────────────────────────────────

function escapeXml(unsafe: string | undefined | null): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

// ─── Helper: calcular tiempo restante ─────────────────────────────────────────

function getTimeRemaining(fechaFin: Date): string {
  const now = new Date();
  const diff = fechaFin.getTime() - now.getTime();

  if (diff <= 0) return '¡FINALIZADO!';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Faltan ${days} ${days === 1 ? 'día' : 'días'}`;
  }
  return `Faltan ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
}

// ─── SVG base ────────────────────────────────────────────────────────────────

function buildSorteoSvg(data: SorteoImageData, theme: SorteoTheme): string {
  const { titulo, premio, fechaFin, juegoNombre } = data;

  const tiempoRestante = getTimeRemaining(fechaFin);
  const fechaFormateada = formatDate(fechaFin);

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
        xmlns="http://www.w3.org/2000/svg">

        <!-- Fondo -->
        <rect width="${W}" height="${H}" fill="${theme.bg}"/>

        <!-- Líneas decorativas de fondo -->
        <line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}"
              stroke="${theme.accent}" stroke-width="0.5" opacity="0.15"/>
        <line x1="${W / 2}" y1="0" x2="${W / 2}" y2="${H}"
              stroke="${theme.accent}" stroke-width="0.5" opacity="0.15"/>

        <!-- Círculos decorativos -->
        <circle cx="${W - 100}" cy="100" r="80" fill="${theme.accent}" opacity="0.1"/>
        <circle cx="100" cy="${H - 100}" r="60" fill="${theme.accentGlow}" opacity="0.08"/>

        <!-- Borde exterior -->
        <rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="16"
              fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.5"/>

        <!-- ── HEADER ── -->
        <rect x="0" y="0" width="${W}" height="140" fill="${theme.bgCardDark}"/>
        <rect x="0" y="138" width="${W}" height="2" fill="${theme.accent}" opacity="0.6"/>

        <!-- Badge SORTEO -->
        <rect x="24" y="24" width="140" height="92" rx="12"
              fill="${theme.premioColor}22"
              stroke="${theme.premioColor}" stroke-width="2"/>
        <text x="94" y="64" text-anchor="middle"
              font-family="sans-serif" font-size="14" letter-spacing="3"
              fill="${theme.premioColor}">SORTEO</text>
        <text x="94" y="92" text-anchor="middle"
              font-family="sans-serif" font-size="32" font-weight="bold"
              fill="${theme.premioColor}">🎁</text>

        <!-- Título del sorteo -->
        <text x="180" y="58"
              font-family="sans-serif" font-size="13" letter-spacing="3"
              fill="${theme.accentGlow}">AJDREW PRESENTA</text>
        <text x="180" y="94"
              font-family="sans-serif" font-size="36" font-weight="bold"
              fill="${theme.textPrimary}">${escapeXml(titulo)}</text>
        <text x="180" y="120"
              font-family="monospace" font-size="13" letter-spacing="2"
              fill="${theme.accent}">${juegoNombre ? '· ' + escapeXml(juegoNombre) : ''}</text>

        <!-- Tiempo restante badge -->
        <rect x="${W - 280}" y="36" width="256" height="68" rx="10"
              fill="${theme.accent}22"
              stroke="${theme.accent}" stroke-width="1"/>
        <text x="${W - 152}" y="64" text-anchor="middle"
              font-family="monospace" font-size="11" letter-spacing="2"
              fill="${theme.accentGlow}">TIEMPO RESTANTE</text>
        <text x="${W - 152}" y="88" text-anchor="middle"
              font-family="monospace" font-size="16" font-weight="bold"
              fill="${theme.textPrimary}">${escapeXml(tiempoRestante)}</text>

        <!-- ── CARD CENTRAL ── -->

        <!-- Sombra -->
        <rect x="${CARD_X + 8}" y="${CARD_Y + 8}" width="${CARD_W}" height="${CARD_H}"
              rx="20" fill="#000000" opacity="0.3"/>

        <!-- Card principal -->
        <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="20"
              fill="${theme.bgCard}"
              stroke="${theme.accent}" stroke-width="2"/>

        <!-- Header de la card -->
        <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="60" rx="20"
              fill="${theme.bgCardDark}"/>
        <rect x="${CARD_X}" y="${CARD_Y + 44}" width="${CARD_W}" height="16"
              fill="${theme.bgCard}"/>

        <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + 40}"
              text-anchor="middle"
              font-family="monospace" font-size="12" letter-spacing="3"
              fill="${theme.accent}">PREMIO DESTACADO</text>

        <!-- Placeholder para imagen del premio -->
        <rect x="${CARD_X + (CARD_W - IMG_SIZE) / 2}" y="${CARD_Y + 80}"
              width="${IMG_SIZE}" height="${IMG_SIZE}" rx="16"
              fill="${theme.bgCardDark}"
              stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="8,4"/>

        <!-- Texto "IMAGEN" en placeholder -->
        <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + 220}"
              text-anchor="middle"
              font-family="sans-serif" font-size="16"
              fill="${theme.textSecondary}" opacity="0.5">PREMIO</text>

        <!-- Nombre del premio -->
        <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + IMG_SIZE + 120}"
              text-anchor="middle"
              font-family="sans-serif" font-size="28" font-weight="bold"
              fill="${theme.premioColor}">${escapeXml(premio)}</text>

        <!-- Fecha de cierre -->
        <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + IMG_SIZE + 170}"
              text-anchor="middle"
              font-family="monospace" font-size="14"
              fill="${theme.textSecondary}">Cierre: ${escapeXml(fechaFormateada)}</text>

        <!-- Decoración de estrellas/partículas -->
        <circle cx="${CARD_X + 60}" cy="${CARD_Y + 60}" r="3" fill="${theme.premioColor}" opacity="0.6"/>
        <circle cx="${CARD_X + CARD_W - 60}" cy="${CARD_Y + 60}" r="3" fill="${theme.premioColor}" opacity="0.6"/>
        <circle cx="${CARD_X + 60}" cy="${CARD_Y + CARD_H - 60}" r="3" fill="${theme.premioColor}" opacity="0.6"/>
        <circle cx="${CARD_X + CARD_W - 60}" cy="${CARD_Y + CARD_H - 60}" r="3" fill="${theme.premioColor}" opacity="0.6"/>

        <!-- ── FOOTER ── -->
        <rect x="0" y="${H - 90}" width="${W}" height="90" fill="${theme.bgCardDark}"/>
        <rect x="0" y="${H - 90}" width="${W}" height="1.5"
              fill="${theme.accent}" opacity="0.5"/>

        <text x="${W / 2}" y="${H - 56}" text-anchor="middle"
              font-family="sans-serif" font-size="14" letter-spacing="2"
              fill="${theme.accent}">PARTICIPA AHORA EN · ajdrew.site</text>
        <text x="${W / 2}" y="${H - 28}" text-anchor="middle"
              font-family="sans-serif" font-size="13"
              fill="${theme.textSecondary}">@ajdrew_oficial · #SorteoAJDREW</text>

        <!-- Iconos decorativos -->
        <text x="100" y="${H - 28}" font-size="20" opacity="0.6">🎮</text>
        <text x="${W - 100}" y="${H - 28}" font-size="20" opacity="0.6">🎮</text>
    </svg>`;
}

// ─── Función principal ────────────────────────────────────────────────────────

export async function generarImagenSorteo(
  data: SorteoImageData,
  theme: SorteoTheme = AJDREW_THEME_SORTEO,
): Promise<Buffer> {
  const svg = buildSorteoSvg(data, theme);

  // Crear base desde SVG
  let base = await sharp(Buffer.from(svg)).png().toBuffer();

  const composites: sharp.OverlayOptions[] = [];

  // Si hay imagen del premio, superponerla
  if (data.imagenBuffer || data.imagenUrl) {
    const imgBuffer = await fetchImageBuffer(data.imagenBuffer, data.imagenUrl);
    if (imgBuffer) {
      const resizedImg = await sharp(imgBuffer)
        .resize(IMG_SIZE, IMG_SIZE, { fit: 'cover', position: 'center' })
        .composite([
          {
            input: Buffer.from(
              `<svg><rect x="0" y="0" width="${IMG_SIZE}" height="${IMG_SIZE}" rx="16" ry="16"/></svg>`,
            ),
            blend: 'dest-in',
          },
        ])
        .png()
        .toBuffer();

      const imgX = CARD_X + (CARD_W - IMG_SIZE) / 2;
      const imgY = CARD_Y + 80;

      composites.push({
        input: resizedImg,
        top: imgY,
        left: imgX,
      });
    }
  }

  if (composites.length > 0) {
    base = await sharp(base).composite(composites).png().toBuffer();
  }

  return base;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
