import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

export interface VsMatchItem {
  name: string;
  image?: string;
}

const G = '#22c55e';        // verde primario
const G_DIM = '#16a34a';
const BG = '#060e06';
const BG_MID = '#0d1a0d';

@Injectable()
export class VsImageGenerator {

  // ── VS Match Image (1080×1080) ─────────────────────────────────
  async generateVsImage(
    tournamentName: string,
    round: number,
    itemA: VsMatchItem,
    itemB: VsMatchItem,
  ): Promise<Buffer> {
    const S = 1080;
    const headerH = 128;
    const footerH = 56;
    const nameBarH = 56;
    const centerW = 160;
    const sideW = (S - centerW) / 2;   // 460 px
    const photoVPad = 60;               // vertical padding above/below photos
    const photoH = S - headerH - footerH - nameBarH - photoVPad * 2; // ~720px

    const logoPath = path.resolve(process.cwd(), 'dist', 'assets', 'logo.png');
    const logoFallback = path.resolve(process.cwd(), 'src', 'assets', 'logo.png');
    const resolvedLogo = fs.existsSync(logoPath)
      ? logoPath
      : fs.existsSync(logoFallback) ? logoFallback : null;

    const composite: sharp.OverlayOptions[] = [];

    // 1. Photos — composited FIRST so SVG layers render on top
    const photoY = headerH + photoVPad;
    const photoA = await this.loadPhoto(itemA.image, sideW, photoH);
    const photoB = await this.loadPhoto(itemB.image, sideW, photoH);
    composite.push({ input: photoA, top: photoY, left: 0 });
    composite.push({ input: photoB, top: photoY, left: sideW + centerW });

    // 2. Dark gradient fade on inner edges of photos
    const fadeA = await this.fadeEdge(80, photoH, 'right');
    const fadeB = await this.fadeEdge(80, photoH, 'left');
    composite.push({ input: fadeA, top: photoY, left: sideW - 80 });
    composite.push({ input: fadeB, top: photoY, left: sideW + centerW });

    // 3. UI SVG
    const nameA = this.truncate(this.esc(itemA.name.toUpperCase()), 15);
    const nameB = this.truncate(this.esc(itemB.name.toUpperCase()), 15);
    const title = this.esc(tournamentName.toUpperCase());
    const roundLabel = this.roundLabel(round);
    const nameBg = photoY + photoH;   // name bar starts right after photo

    // Center column solid background
    const centerH = photoH + photoVPad; // extend down to include padding below photo
    const centerBgBuf = await sharp({
      create: { width: centerW, height: S - headerH - footerH, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).png().toBuffer();
    composite.push({ input: centerBgBuf, top: headerH, left: sideW });

    const uiSvg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="45%" stop-color="${BG_MID}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
    <linearGradient id="ftr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${G_DIM}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${G}"/>
      <stop offset="100%" stop-color="${G_DIM}" stop-opacity="0.8"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="14" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- HEADER -->
  <rect x="0" y="0" width="${S}" height="${headerH}" fill="url(#hdr)"/>
  <rect x="0" y="0" width="${S}" height="4" fill="url(#ftr)"/>
  <text x="${S/2}" y="50" font-family="Arial Black,sans-serif" font-size="17" font-weight="900"
        fill="${G}" text-anchor="middle" letter-spacing="4">${title}</text>
  <rect x="${S/2-76}" y="62" width="152" height="30" rx="15"
        fill="${G}" fill-opacity="0.14" stroke="${G}" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="${S/2}" y="82" font-family="Arial Black,sans-serif" font-size="12" font-weight="900"
        fill="#86efac" text-anchor="middle" letter-spacing="3">${roundLabel}</text>
  <line x1="40" y1="${headerH-1}" x2="${S-40}" y2="${headerH-1}" stroke="${G}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- CENTER DIVIDERS (green lines on sides of center column) -->
  <line x1="${sideW}" y1="${headerH}" x2="${sideW}" y2="${nameBg + nameBarH}" stroke="${G}" stroke-opacity="0.6" stroke-width="2"/>
  <line x1="${sideW+centerW}" y1="${headerH}" x2="${sideW+centerW}" y2="${nameBg + nameBarH}" stroke="${G}" stroke-opacity="0.6" stroke-width="2"/>

  <!-- VS text centered on photo zone -->
  <text x="${sideW+centerW/2}" y="${photoY+photoH/2+30}" font-family="Arial Black,sans-serif" font-size="84" font-weight="900"
        fill="${G}" text-anchor="middle" opacity="0.18" filter="url(#glow)">VS</text>
  <text x="${sideW+centerW/2}" y="${photoY+photoH/2+30}" font-family="Arial Black,sans-serif" font-size="84" font-weight="900"
        fill="#ffffff" text-anchor="middle">VS</text>
  <circle cx="${sideW+centerW/2}" cy="${photoY+photoH/2-56}" r="5" fill="${G}" opacity="0.85"/>

  <!-- NAME BARS (solid bg) -->
  <rect x="0" y="${nameBg}" width="${sideW}" height="${nameBarH}" fill="${BG}" fill-opacity="0.94"/>
  <rect x="${sideW+centerW}" y="${nameBg}" width="${sideW}" height="${nameBarH}" fill="${BG}" fill-opacity="0.94"/>
  <text x="${sideW/2}" y="${nameBg+nameBarH/2+7}" font-family="Arial Black,sans-serif" font-size="20" font-weight="900"
        fill="#ffffff" text-anchor="middle">${nameA}</text>
  <text x="${sideW+centerW+sideW/2}" y="${nameBg+nameBarH/2+7}" font-family="Arial Black,sans-serif" font-size="20" font-weight="900"
        fill="#ffffff" text-anchor="middle">${nameB}</text>

  <!-- FOOTER -->
  <rect x="0" y="${S-footerH}" width="${S}" height="${footerH}" fill="url(#ftr)"/>
  <text x="${S/2}" y="${S-footerH/2+8}" font-family="Arial Black,sans-serif" font-size="16" font-weight="900"
        fill="#000000" fill-opacity="0.75" text-anchor="middle" letter-spacing="6">AJDREW.SITE</text>
</svg>`;

    composite.push({ input: Buffer.from(uiSvg), top: 0, left: 0 });

    // 4. Logo
    if (resolvedLogo) {
      try {
        const logo = await sharp(resolvedLogo)
          .resize({ width: 60, height: 60, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png().toBuffer();
        composite.push({ input: logo, top: 30, left: 32 });
      } catch (_) {}
    }

    return sharp({
      create: { width: S, height: S, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).composite(composite).png().toBuffer();
  }

  // ── Round List Image (1080×1080) ─────────────────────────────────
  async generateRoundListImage(
    tournamentName: string,
    roundNumber: number,
    matches: Array<{ itemA: VsMatchItem | null; itemB: VsMatchItem | null }>,
  ): Promise<Buffer> {
    const S = 1080;
    const headerH = 180;
    const footerH = 64;
    const paddingX = 40;
    const availableH = S - headerH - footerH;
    
    // Calculate card height
    const gap = 16;
    const N = matches.length;
    const totalGap = (N - 1) * gap;
    // max height for 2 matches could be 140 to not look too big, if 8 matches it's ~80
    const calculatedH = Math.floor((availableH - totalGap - 40) / N);
    const cardH = Math.min(140, calculatedH);
    const totalCardsH = N * cardH + totalGap;
    const startY = headerH + (availableH - totalCardsH) / 2;

    const logoPath = path.resolve(process.cwd(), 'dist', 'assets', 'logo.png');
    const logoFallback = path.resolve(process.cwd(), 'src', 'assets', 'logo.png');
    const resolvedLogo = fs.existsSync(logoPath) ? logoPath : fs.existsSync(logoFallback) ? logoFallback : null;

    const composite: sharp.OverlayOptions[] = [];

    let cardsBgSvg = '';
    let cardsFgSvg = '';
    const nameFontSize = cardH * 0.25;
    const vsFontSize = cardH * 0.35;
    const photoSize = cardH - 16;
    const borderRadius = 12;

    for (let i = 0; i < N; i++) {
        const m = matches[i];
        const y = startY + i * (cardH + gap);
        const nameA = m.itemA ? this.truncate(this.esc(m.itemA.name), 16) : 'TBD';
        const nameB = m.itemB ? this.truncate(this.esc(m.itemB.name), 16) : 'TBD';

        // Background of card goes to Bg SVG
        cardsBgSvg += `
        <rect x="${paddingX}" y="${y}" width="${S - paddingX * 2}" height="${cardH}" rx="${borderRadius}" fill="#111111" stroke="${G}" stroke-opacity="0.1" stroke-width="1.5"/>
        `;

        const photoLeftX = paddingX + 16;
        const photoRightX = S - paddingX - 16 - photoSize;

        if (m.itemA?.image) {
            const photoBuf = await this.loadPhoto(m.itemA.image, photoSize, photoSize);
            composite.push({ input: photoBuf, top: Math.floor(y + 8), left: Math.floor(photoLeftX) });
        }
        if (m.itemB?.image) {
            const photoBuf = await this.loadPhoto(m.itemB.image, photoSize, photoSize);
            composite.push({ input: photoBuf, top: Math.floor(y + 8), left: Math.floor(photoRightX) });
        }

        // Fades and text go to Fg SVG
        cardsFgSvg += `
        <!-- Left Photo Fade -->
        <rect x="${photoLeftX}" y="${y+8}" width="${photoSize}" height="${photoSize}" fill="url(#photoFadeL)"/>
        <!-- Right Photo Fade -->
        <rect x="${photoRightX}" y="${y+8}" width="${photoSize}" height="${photoSize}" fill="url(#photoFadeR)"/>
        
        <text x="${photoLeftX + photoSize + 20}" y="${y + cardH / 2 + nameFontSize / 3}" font-family="Arial Black,sans-serif" font-size="${nameFontSize}" fill="#ffffff" font-weight="900" text-anchor="start">${nameA}</text>
        
        <text x="${S/2}" y="${y + cardH / 2 + vsFontSize / 3}" font-family="Arial Black,sans-serif" font-size="${vsFontSize}" fill="${G}" font-weight="900" text-anchor="middle">VS</text>
        
        <text x="${photoRightX - 20}" y="${y + cardH / 2 + nameFontSize / 3}" font-family="Arial Black,sans-serif" font-size="${nameFontSize}" fill="#ffffff" font-weight="900" text-anchor="end">${nameB}</text>
        `;
    }

    const title = this.truncate(this.esc(tournamentName), 25);
    
    const bgSvg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  ${cardsBgSvg}
</svg>`;

    // Insert Background BEFORE photos
    composite.unshift({ input: Buffer.from(bgSvg), top: 0, left: 0 });

    const fgSvg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="photoFadeL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="60%" stop-color="#111111" stop-opacity="0"/>
      <stop offset="100%" stop-color="#111111" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="photoFadeR" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#111111" stop-opacity="1"/>
      <stop offset="40%" stop-color="#111111" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- HEADER -->
  <text x="${S/2}" y="50" font-family="Arial Black,sans-serif" font-size="16" fill="${G}" font-weight="900" text-anchor="middle" letter-spacing="4">NUEVA RONDA DE VOTACIÓN</text>
  <text x="${S/2}" y="100" font-family="Arial Black,sans-serif" font-size="42" fill="#ffffff" font-weight="900" text-anchor="middle">${title}</text>
  <text x="${S/2}" y="140" font-family="Arial Black,sans-serif" font-size="20" fill="#aaaaaa" font-weight="900" text-anchor="middle" letter-spacing="2">RONDA ${roundNumber} - EN VIVO</text>

  <!-- MATCHES OVERLAY -->
  ${cardsFgSvg}

  <!-- FOOTER -->
  <rect x="0" y="${S-footerH}" width="${S}" height="${footerH}" fill="${G}"/>
  <text x="${S/2}" y="${S - footerH/2 + 8}" font-family="Arial Black,sans-serif" font-size="20" fill="#000000" font-weight="900" text-anchor="middle" letter-spacing="3">¡ENTRA Y VOTA AHORA!</text>
</svg>`;

    composite.push({ input: Buffer.from(fgSvg), top: 0, left: 0 });

    if (resolvedLogo) {
      try {
        const logo = await sharp(resolvedLogo)
          .resize({ width: 50, height: 50, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png().toBuffer();
        composite.push({ input: logo, top: 25, left: 35 });
      } catch (_) {}
    }

    return sharp({
      create: { width: S, height: S, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 255 } },
    }).composite(composite).png().toBuffer();
  }

  // ── Champion Image (1080×1080) — VS-style con ganador resaltado ───
  async generateChampionImage(
    tournamentName: string,
    champion: VsMatchItem,
    finalist: VsMatchItem | null,
  ): Promise<Buffer> {
    // If no finalist data, fall back to a single-winner image
    if (!finalist) {
      return this.generateSingleChampionImage(tournamentName, champion);
    }

    const S = 1080;
    const headerH = 128;
    const footerH = 56;
    const nameBarH = 64;
    const centerW = 160;
    const sideW = (S - centerW) / 2;
    const photoVPad = 50;
    const photoH = S - headerH - footerH - nameBarH - photoVPad * 2;
    const photoY = headerH + photoVPad;
    const nameBg = photoY + photoH;

    const logoPath = path.resolve(process.cwd(), 'dist', 'assets', 'logo.png');
    const logoFallback = path.resolve(process.cwd(), 'src', 'assets', 'logo.png');
    const resolvedLogo = fs.existsSync(logoPath) ? logoPath : fs.existsSync(logoFallback) ? logoFallback : null;

    const composite: sharp.OverlayOptions[] = [];

    // 1. Fondo oscuro para ambos lados (para cartas con transparencia o fondo blanco)
    const darkBg = await sharp({
      create: { width: sideW, height: photoH, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).png().toBuffer();
    composite.push({ input: darkBg, top: photoY, left: 0 });
    composite.push({ input: darkBg, top: photoY, left: sideW + centerW });

    // 2. Fotos: ganador izq, finalista der
    const photoChamp = await this.loadPhoto(champion.image, sideW, photoH);
    const photoFin = await this.loadPhoto(finalist.image, sideW, photoH);

    composite.push({ input: photoChamp, top: photoY, left: 0 });
    composite.push({ input: photoFin, top: photoY, left: sideW + centerW });

    // 3. Fades internos
    const fadeA = await this.fadeEdge(80, photoH, 'right');
    const fadeB = await this.fadeEdge(80, photoH, 'left');
    composite.push({ input: fadeA, top: photoY, left: sideW - 80 });
    composite.push({ input: fadeB, top: photoY, left: sideW + centerW });

    // 4. Centro sólido
    const centerBg = await sharp({
      create: { width: centerW, height: S - headerH - footerH, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).png().toBuffer();
    composite.push({ input: centerBg, top: headerH, left: sideW });

    const champName = this.truncate(this.esc(champion.name.toUpperCase()), 15);
    const finalistName = this.truncate(this.esc(finalist.name.toUpperCase()), 15);
    const title = this.esc(tournamentName.toUpperCase());

    const uiSvg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="45%" stop-color="${BG_MID}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
    <linearGradient id="ftr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${G_DIM}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${G}"/>
      <stop offset="100%" stop-color="${G_DIM}" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="champGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${G}" stop-opacity="0.55"/>
      <stop offset="85%" stop-color="${G}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${G}" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="14" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Green glow overlay on champion's side -->
  <rect x="0" y="${photoY}" width="${sideW}" height="${photoH}" fill="url(#champGlow)"/>
  <rect x="0" y="${photoY}" width="4" height="${photoH}" fill="${G}" opacity="0.9"/>

  <!-- HEADER -->
  <rect x="0" y="0" width="${S}" height="${headerH}" fill="url(#hdr)"/>
  <rect x="0" y="0" width="${S}" height="4" fill="url(#ftr)"/>
  <text x="${S/2}" y="50" font-family="Arial Black,sans-serif" font-size="17" font-weight="900"
        fill="${G}" text-anchor="middle" letter-spacing="4">${title}</text>
  <rect x="${S/2-92}" y="62" width="184" height="30" rx="15"
        fill="${G}" fill-opacity="0.14" stroke="${G}" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="${S/2}" y="82" font-family="Arial Black,sans-serif" font-size="12" font-weight="900"
        fill="#86efac" text-anchor="middle" letter-spacing="3">🏆 GRAN FINAL 🏆</text>
  <line x1="40" y1="${headerH-1}" x2="${S-40}" y2="${headerH-1}" stroke="${G}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- CENTER LINES -->
  <line x1="${sideW}" y1="${headerH}" x2="${sideW}" y2="${nameBg + nameBarH}" stroke="${G}" stroke-opacity="0.6" stroke-width="2"/>
  <line x1="${sideW+centerW}" y1="${headerH}" x2="${sideW+centerW}" y2="${nameBg + nameBarH}" stroke="${G}" stroke-opacity="0.6" stroke-width="2"/>

  <!-- CAMPEÓN crown badge on champion side -->
  <text x="${sideW/2}" y="${photoY + 46}" font-family="Arial,sans-serif" font-size="36" text-anchor="middle">👑</text>
  <rect x="${sideW/2 - 58}" y="${photoY + 52}" width="116" height="24" rx="12"
        fill="${G}" fill-opacity="0.9"/>
  <text x="${sideW/2}" y="${photoY + 69}" font-family="Arial Black,sans-serif" font-size="11" font-weight="900"
        fill="#000000" text-anchor="middle" letter-spacing="2">CAMPEÓN</text>

  <!-- VS text centered -->
  <text x="${sideW+centerW/2}" y="${photoY+photoH/2+30}" font-family="Arial Black,sans-serif" font-size="84" font-weight="900"
        fill="${G}" text-anchor="middle" opacity="0.18" filter="url(#glow)">VS</text>
  <text x="${sideW+centerW/2}" y="${photoY+photoH/2+30}" font-family="Arial Black,sans-serif" font-size="84" font-weight="900"
        fill="#ffffff" text-anchor="middle">VS</text>

  <!-- NAME BARS -->
  <rect x="0" y="${nameBg}" width="${sideW}" height="${nameBarH}" fill="${G}" fill-opacity="0.92"/>
  <rect x="${sideW+centerW}" y="${nameBg}" width="${sideW}" height="${nameBarH}" fill="${BG}" fill-opacity="0.94"/>

  <text x="${sideW/2}" y="${nameBg+nameBarH/2+7}" font-family="Arial Black,sans-serif" font-size="20" font-weight="900"
        fill="#000000" text-anchor="middle">${champName}</text>
  <text x="${sideW+centerW+sideW/2}" y="${nameBg+nameBarH/2+7}" font-family="Arial Black,sans-serif" font-size="16" font-weight="900"
        fill="#ffffff" text-anchor="middle">${finalistName}</text>

  <!-- FOOTER -->
  <rect x="0" y="${S-footerH}" width="${S}" height="${footerH}" fill="url(#ftr)"/>
  <text x="${S/2}" y="${S-footerH/2+8}" font-family="Arial Black,sans-serif" font-size="16" font-weight="900"
        fill="#000000" fill-opacity="0.75" text-anchor="middle" letter-spacing="6">AJDREW.SITE</text>
</svg>`;

    composite.push({ input: Buffer.from(uiSvg), top: 0, left: 0 });

    if (resolvedLogo) {
      try {
        const logo = await sharp(resolvedLogo)
          .resize({ width: 60, height: 60, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png().toBuffer();
        composite.push({ input: logo, top: 30, left: 32 });
      } catch (_) {}
    }

    return sharp({
      create: { width: S, height: S, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).composite(composite).png().toBuffer();
  }

  /** Fallback si no hay finalista conocido */
  private async generateSingleChampionImage(
    tournamentName: string,
    champion: VsMatchItem,
  ): Promise<Buffer> {
    const S = 1080;
    const headerH = 130;
    const footerH = 56;
    const nameBarH = 90;
    const photoH = S - headerH - footerH - nameBarH;

    const composite: sharp.OverlayOptions[] = [];
    const photo = await this.loadPhoto(champion.image, S, photoH);
    composite.push({ input: photo, top: headerH, left: 0 });

    const champName = this.truncate(this.esc(champion.name.toUpperCase()), 18);
    const title = this.esc(tournamentName.toUpperCase());

    const svg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ftr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${G_DIM}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${G}"/>
      <stop offset="100%" stop-color="${G_DIM}" stop-opacity="0.8"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect x="0" y="0" width="${S}" height="${headerH}" fill="${BG}" fill-opacity="0.97"/>
  <rect x="0" y="0" width="${S}" height="4" fill="url(#ftr)"/>
  <text x="${S/2}" y="50" font-family="Arial Black,sans-serif" font-size="15" fill="${G}" text-anchor="middle" letter-spacing="5">${title}</text>
  <rect x="${S/2-90}" y="62" width="180" height="30" rx="15" fill="${G}" fill-opacity="0.15" stroke="${G}" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="${S/2}" y="82" font-family="Arial Black,sans-serif" font-size="12" font-weight="900" fill="#86efac" text-anchor="middle" letter-spacing="3">🏆 CAMPEÓN 🏆</text>
  <rect x="0" y="${headerH + photoH}" width="${S}" height="${nameBarH}" fill="${BG}"/>
  <text x="${S/2}" y="${headerH + photoH + 30}" font-family="Arial,sans-serif" font-size="28" text-anchor="middle">👑</text>
  <text x="${S/2}" y="${headerH + photoH + 72}" font-family="Arial Black,sans-serif" font-size="36" font-weight="900" fill="${G}" text-anchor="middle" filter="url(#glow)">${champName}</text>
  <rect x="0" y="${S-footerH}" width="${S}" height="${footerH}" fill="url(#ftr)"/>
  <text x="${S/2}" y="${S-footerH/2+8}" font-family="Arial Black,sans-serif" font-size="16" fill="#000000" fill-opacity="0.75" text-anchor="middle" letter-spacing="6">AJDREW.SITE</text>
</svg>`;

    composite.push({ input: Buffer.from(svg), top: 0, left: 0 });
    return sharp({
      create: { width: S, height: S, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).composite(composite).png().toBuffer();
  }

  // ── Helpers ────────────────────────────────────────────────────

  private async loadPhoto(url: string | undefined, w: number, h: number): Promise<Buffer> {
    if (url?.startsWith('http')) {
      try {
        const raw = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
        return await sharp(Buffer.from(raw.data))
          .resize({ width: w, height: h, fit: 'contain', background: { r: 8, g: 16, b: 8, alpha: 255 } })
          .png()
          .toBuffer();
      } catch (e) {
        console.error('[VsImageGenerator] Failed to load photo:', url, e?.message);
      }
    }
    // Placeholder verde oscuro
    return sharp({
      create: { width: w, height: h, channels: 4, background: { r: 8, g: 20, b: 8, alpha: 255 } },
    }).png().toBuffer();
  }

  /** Fade buffer: dark strip that fades from transparent to BG_DARK */
  private async fadeEdge(w: number, h: number, dir: 'left' | 'right'): Promise<Buffer> {
    const x1 = dir === 'right' ? 0 : 1;
    const x2 = dir === 'right' ? 1 : 0;
    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="f" x1="${x1}" y1="0" x2="${x2}" y2="0">
          <stop offset="0%" stop-color="${BG}" stop-opacity="0"/>
          <stop offset="100%" stop-color="${BG}" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#f)"/>
    </svg>`;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  private roundLabel(r: number): string {
    return ({ 1: 'RONDA 1', 2: 'CUARTOS DE FINAL', 3: 'SEMIFINAL', 4: 'FINAL' } as Record<number, string>)[r]
      ?? `RONDA ${r}`;
  }

  private truncate(s: string, max: number): string {
    return s.length <= max ? s : s.substring(0, max) + '...';
  }

  private esc(s: string): string {
    return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] ?? c));
  }
}
