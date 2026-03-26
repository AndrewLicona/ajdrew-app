import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

export interface RankingItemMeta {
  itemName: string;
  itemImage?: string;
  averageRating: number;
  voteCount?: number;
}

const G = '#22c55e';
const G_DIM = '#16a34a';
const BG = '#060e06';
const BG_MID = '#0d1a0d';

@Injectable()
export class RankingImageGenerator {
  constructor() {}

  async generateRankingImage(
    title: string,
    topItems: RankingItemMeta[],
  ): Promise<Buffer> {
    const S = 1080;

    const sorted = [...topItems]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 6);

    // ── Layout ─────────────────────────────────────────────────────
    const headerH = 150;
    const footerH = 56;
    const padX = 40;
    const colGap = 14;
    const rowGap = 14;
    const cols = 3;

    // Smaller cards: 250×250 photo + 48 name bar = 298 total
    const cardW = Math.floor((S - 2 * padX - (cols - 1) * colGap) / cols); // ~310px
    const imgH = Math.floor(cardW * 0.78); // ~242px — smaller than square
    const nameBarH = 44;
    const cardH = imgH + nameBarH;

    const contentH = S - headerH - footerH;
    const rows = Math.ceil(sorted.length / cols);
    const rowsH = rows * cardH + (rows - 1) * rowGap;
    const startY = headerH + Math.floor((contentH - rowsH) / 2);

    const composite: sharp.OverlayOptions[] = [];

    // ── Step 1: Item photos (composited FIRST, under everything) ───
    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const totalInRow = Math.min(cols, sorted.length - row * cols);
      const rowTotalW = totalInRow * cardW + (totalInRow - 1) * colGap;
      const rowStartX = padX + Math.floor((S - 2 * padX - rowTotalW) / 2);
      const cx = rowStartX + col * (cardW + colGap);
      const cy = startY + row * (cardH + rowGap);

      let photoBuf: Buffer;
      if (item.itemImage?.startsWith('http')) {
        try {
          const raw = await axios.get(item.itemImage, { responseType: 'arraybuffer', timeout: 8000 });
          photoBuf = await sharp(Buffer.from(raw.data))
            .resize({ width: cardW, height: imgH, fit: 'contain', background: { r: 8, g: 16, b: 8, alpha: 255 } })
            .png().toBuffer();
        } catch {
          photoBuf = await this.makeFill(cardW, imgH, { r: 18, g: 30, b: 18 });
        }
      } else {
        photoBuf = await this.makeFill(cardW, imgH, { r: 18, g: 30, b: 18 });
      }
      composite.push({ input: photoBuf, top: cy, left: cx });
    }

    // ── Step 2: Build card meta SVG (name bars, badges, NO background rect) ──
    let cardsSvg = '';
    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.2)'];

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const totalInRow = Math.min(cols, sorted.length - row * cols);
      const rowTotalW = totalInRow * cardW + (totalInRow - 1) * colGap;
      const rowStartX = padX + Math.floor((S - 2 * padX - rowTotalW) / 2);
      const cx = rowStartX + col * (cardW + colGap);
      const cy = startY + row * (cardH + rowGap);
      const metaY = cy + imgH;

      // Name bar background
      cardsSvg += `<rect x="${cx}" y="${metaY}" width="${cardW}" height="${nameBarH}" fill="#0a120a" fill-opacity="0.95"/>`;
      cardsSvg += `<line x1="${cx}" y1="${metaY}" x2="${cx + cardW}" y2="${metaY}" stroke="${G}" stroke-opacity="0.25" stroke-width="1"/>`;

      // Name text
      const name = this.truncateText(item.itemName.toUpperCase(), 15);
      cardsSvg += `<text x="${cx + cardW / 2}" y="${metaY + nameBarH / 2 + 6}" font-family="Arial Black, sans-serif" font-size="15" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">${name}</text>`;

      // Rank badge
      const medalColor = medalColors[i] ?? 'rgba(255,255,255,0.2)';
      const bx = cx + 8;
      const by = cy + 8;
      const br = 16;
      cardsSvg += `<circle cx="${bx + br}" cy="${by + br}" r="${br}" fill="rgba(0,0,0,0.7)" stroke="${medalColor}" stroke-width="2"/>`;
      cardsSvg += `<text x="${bx + br}" y="${by + br + 5}" font-family="Arial Black, sans-serif" font-size="13" font-weight="900" fill="${medalColor}" text-anchor="middle">${i + 1}</text>`;

      // Thin green border around card
      cardsSvg += `<rect x="${cx}" y="${cy}" width="${cardW}" height="${cardH}" fill="none" stroke="${G}" stroke-opacity="0.2" stroke-width="1" rx="2"/>`;
    }

    // ── Step 3: Main UI SVG (header + footer + card overlays, NO full bg rect) ──
    const mainSvg = `
<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${G_DIM}" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="${G}"/>
      <stop offset="100%" stop-color="${G_DIM}" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <!-- Subtle grid lines (very faint, overlaid on everything) -->
  ${Array.from({ length: 18 }, (_, i) =>
    `<line x1="0" y1="${60 * i}" x2="${S}" y2="${60 * i}" stroke="${G}" stroke-opacity="0.025" stroke-width="1"/>`
  ).join('')}

  <!-- Header block (solid, covers top area above the cards) -->
  <rect x="0" y="0" width="${S}" height="${headerH}" fill="#060e06" fill-opacity="0.98"/>
  <rect x="0" y="0" width="${S}" height="5" fill="url(#accent)"/>

  <!-- RANKING OFICIAL label (offset right to clear 60px logo) -->
  <text x="${padX + 75}" y="75" font-family="Arial Black, sans-serif" font-size="12" fill="${G}" letter-spacing="5" dominant-baseline="middle">RANKING OFICIAL</text>

  <!-- Separator -->
  <line x1="${padX}" y1="92" x2="${S - padX}" y2="92" stroke="${G}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- Title -->
  <text x="${S / 2}" y="118" font-family="Arial Black, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">Top ${sorted.length}: ${this.escapeXml(title)}</text>

  <!-- Bottom border of header -->
  <line x1="${padX}" y1="${headerH - 2}" x2="${S - padX}" y2="${headerH - 2}" stroke="${G}" stroke-opacity="0.10" stroke-width="1"/>

  <!-- Card overlays (name bars + badges — NO background rects over photo zones) -->
  ${cardsSvg}

  <!-- Footer -->
  <rect x="0" y="${S - footerH}" width="${S}" height="${footerH}" fill="url(#accent)"/>
  <text x="${S / 2}" y="${S - footerH / 2 + 7}" font-family="Arial Black, sans-serif" font-size="17" fill="#000000" text-anchor="middle" letter-spacing="5">AJDREW.SITE</text>
  <rect x="0" y="${S - 3}" width="${S}" height="3" fill="${G}"/>
</svg>`;


    composite.push({ input: Buffer.from(mainSvg), top: 0, left: 0 });

    // ── Step 4: Logo ──────────────────────────────────────────────
    const logoPath = path.resolve(process.cwd(), 'dist', 'assets', 'logo.png');
    const logoFallback = path.resolve(process.cwd(), 'src', 'assets', 'logo.png');
    const resolvedLogo = fs.existsSync(logoPath) ? logoPath : fs.existsSync(logoFallback) ? logoFallback : null;
    if (resolvedLogo) {
      try {
        const logoResized = await sharp(resolvedLogo)
          .resize({ width: 60, height: 60, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png().toBuffer();
        composite.push({ input: logoResized, top: 45, left: padX });
      } catch (e) { console.error('Logo error:', e); }
    }

    return sharp({
      create: { width: S, height: S, channels: 4, background: { r: 6, g: 14, b: 6, alpha: 255 } },
    }).composite(composite).png().toBuffer();
  }

  private async makeFill(w: number, h: number, c: { r: number; g: number; b: number }): Promise<Buffer> {
    return sharp({ create: { width: w, height: h, channels: 4, background: { ...c, alpha: 255 } } }).png().toBuffer();
  }

  private truncateText(text: string, len: number): string {
    const e = this.escapeXml(text);
    return e.length <= len ? e : e.substring(0, len) + '...';
  }

  private escapeXml(s: string): string {
    return s.replace(/[<>&'"]/g, c =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] ?? c)
    );
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 });
    return Buffer.from(r.data, 'binary');
  }
}
