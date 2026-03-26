import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import sharp from 'sharp';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BracketImageService {
  private readonly logger = new Logger(BracketImageService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Generates a 1080×1080 bracket-tree image.
   * Layout concept (based on reference image):
   *   - Blue/dark background
   *   - Left column: item thumbnails (round participants)
   *   - Center column: bracket lines + logo/emblem
   *   - Right column (for 4+ items): other participants
   */
  async generateBracketImage(bracketId: string, round: number): Promise<Buffer> {
    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: bracketId },
        include: {
          matches: {
            where: { ronda: round },
            take: 8,
            include: { itemA: true, itemB: true },
          },
        },
      });

      if (!bracket) throw new Error('Bracket not found');

      const S = 1080;
      const compositeOps: sharp.OverlayOptions[] = [];

      // Download item images
      const imgCache = new Map<string, Buffer | null>();
      for (const m of bracket.matches) {
        for (const item of [m.itemA, m.itemB]) {
          if (item && item.image && !imgCache.has(item.id)) {
            try {
              imgCache.set(item.id, item.image.startsWith('http')
                ? await this.downloadImage(item.image) : null);
            } catch { imgCache.set(item.id, null); }
          }
        }
      }

      const matches = bracket.matches.slice(0, 8);
      const totalSlots = matches.length * 2; // participants
      const leftItems = matches.map(m => m.itemA);
      const rightItems = matches.map(m => m.itemB);

      // ── SVG layout constants ──────────────────────────────────────
      const padX = 32;
      const padY = 140;          // below header
      const thumbSize = 96;
      const slotH = 120;         // height for each item slot
      const centerX = S / 2;

      // Left column X (right edge) and right column X (left edge)
      const colW = 220;
      const leftColRight = padX + colW;
      const rightColLeft = S - padX - colW;

      // Build item slot SVGs
      let slotsSvg = '';

      const renderSlot = (item: any | null, slotX: number, slotY: number, alignRight: boolean) => {
        const itemName = item ? this.truncateXml(item.nombre, 14) : '???';
        const textX = alignRight ? slotX + 8 : slotX + thumbSize + 12;
        const textAnchor = 'start';

        // Slot bg
        slotsSvg += `<rect x="${slotX - (alignRight ? colW - thumbSize - 8 : 0)}" y="${slotY}" width="${colW}" height="${thumbSize}" rx="14" fill="#1a2a4a" stroke="#3b82f6" stroke-width="1.2" stroke-opacity="0.5"/>`;

        if (alignRight) {
          // Name on left, image on right edge
          const nameX = slotX - colW + thumbSize + 16;
          slotsSvg += `<text x="${nameX}" y="${slotY + thumbSize / 2 + 5}" font-family="Arial Black, sans-serif" font-size="14" fill="#ffffff" dominant-baseline="middle">${itemName}</text>`;
        } else {
          slotsSvg += `<text x="${textX}" y="${slotY + thumbSize / 2 + 5}" font-family="Arial Black, sans-serif" font-size="14" fill="#ffffff" dominant-baseline="middle">${itemName}</text>`;
        }
      };

      // Bracket tree lines (SVG)
      let linesSvg = '';

      // For each match pair on the left side
      const leftSlotY = (i: number) => padY + i * slotH;

      for (let i = 0; i < leftItems.length; i++) {
        const itemY = leftSlotY(i) + thumbSize / 2;
        // Horizontal line from item to center bracket
        linesSvg += `<line x1="${leftColRight + 4}" y1="${itemY}" x2="${leftColRight + 60}" y2="${itemY}" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.6"/>`;
      }
      // Vertical connecting lines between pairs
      for (let i = 0; i < Math.floor(leftItems.length / 2); i++) {
        const y1 = leftSlotY(i * 2) + thumbSize / 2;
        const y2 = leftSlotY(i * 2 + 1) + thumbSize / 2;
        const midY = (y1 + y2) / 2;
        linesSvg += `<line x1="${leftColRight + 60}" y1="${y1}" x2="${leftColRight + 60}" y2="${y2}" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.6"/>`;
        // Line to center
        linesSvg += `<line x1="${leftColRight + 60}" y1="${midY}" x2="${centerX - 80}" y2="${midY}" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.6"/>`;

        // Left bracket next-round placeholder
        linesSvg += `<rect x="${leftColRight + 60}" y="${midY - 28}" width="120" height="56" rx="10" fill="#0f2040" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.4"/>`;
      }

      // Right side mirror
      for (let i = 0; i < rightItems.length; i++) {
        const itemY = leftSlotY(i) + thumbSize / 2;
        linesSvg += `<line x1="${rightColLeft - 4}" y1="${itemY}" x2="${rightColLeft - 60}" y2="${itemY}" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.6"/>`;
      }
      for (let i = 0; i < Math.floor(rightItems.length / 2); i++) {
        const y1 = leftSlotY(i * 2) + thumbSize / 2;
        const y2 = leftSlotY(i * 2 + 1) + thumbSize / 2;
        const midY = (y1 + y2) / 2;
        linesSvg += `<line x1="${rightColLeft - 60}" y1="${y1}" x2="${rightColLeft - 60}" y2="${y2}" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.6"/>`;
        linesSvg += `<line x1="${rightColLeft - 60}" y1="${midY}" x2="${centerX + 80}" y2="${midY}" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.6"/>`;
        linesSvg += `<rect x="${rightColLeft - 180}" y="${midY - 28}" width="120" height="56" rx="10" fill="#0f2040" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.4"/>`;
      }

      // Center trophy placeholder
      linesSvg += `<rect x="${centerX - 64}" y="${padY + (matches.length * slotH) / 2 - 80}" width="128" height="128" rx="16" fill="#0a1a35" stroke="#60a5fa" stroke-width="2.5" stroke-opacity="0.7"/>`;
      linesSvg += `<text x="${centerX}" y="${padY + (matches.length * slotH) / 2 - 6}" font-family="Arial Black, sans-serif" font-size="40" text-anchor="middle">🏆</text>`;

      // Build item slots
      for (let i = 0; i < leftItems.length; i++) {
        const y = leftSlotY(i);
        renderSlot(leftItems[i], padX, y, false);
      }
      for (let i = 0; i < rightItems.length; i++) {
        const y = leftSlotY(i);
        renderSlot(rightItems[i], rightColLeft, y, true);
      }

      const tematica = this.escapeXml(bracket.tematica || 'VOTACIÓN');
      const contentH = Math.max(matches.length * slotH + padY + 80, 700);

      // Main SVG
      const mainSvg = `
<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1730" stop-opacity="1"/>
      <stop offset="100%" stop-color="#050d1a" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#60a5fa" stop-opacity="1"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.7"/>
    </linearGradient>
    <!-- Hexagon-like pattern hint -->
    <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
      <polygon points="30,2 58,17 58,47 30,62 2,47 2,17"
        fill="none" stroke="#3b82f6" stroke-width="0.5" stroke-opacity="0.07"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <rect width="${S}" height="${S}" fill="url(#hex)"/>

  <!-- Top accent -->
  <rect x="0" y="0" width="${S}" height="6" fill="url(#accent)"/>

  <!-- Header -->
  <rect x="0" y="0" width="${S}" height="125" fill="#3b82f6" opacity="0.08"/>
  <text x="${S / 2}" y="58" font-family="Arial Black, sans-serif" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle">${tematica}</text>
  <text x="${S / 2}" y="92" font-family="Arial, sans-serif" font-size="16" fill="#60a5fa" text-anchor="middle" letter-spacing="7">RONDA ${round} · BRACKET</text>
  <line x1="60" y1="115" x2="${S - 60}" y2="115" stroke="#3b82f6" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Bracket lines -->
  ${linesSvg}

  <!-- Item slots -->
  ${slotsSvg}

  <!-- Bottom bar -->
  <rect x="0" y="${S - 52}" width="${S}" height="52" fill="url(#accent)"/>
  <text x="${S / 2}" y="${S - 17}" font-family="Arial Black, sans-serif" font-size="18" fill="#000000" text-anchor="middle" letter-spacing="4">¡ENTRA Y VOTA EN AJDREW.SITE!</text>
  <rect x="0" y="${S - 3}" width="${S}" height="3" fill="#60a5fa"/>
</svg>`;

      compositeOps.push({ input: Buffer.from(mainSvg), top: 0, left: 0 });

      // ── Logo top-left ─────────────────────────────────────────────
      const logoPath = path.resolve(process.cwd(), 'dist', 'assets', 'logo.png');
      const logoFallback = path.resolve(process.cwd(), 'src', 'assets', 'logo.png');
      const resolvedLogo = fs.existsSync(logoPath) ? logoPath : fs.existsSync(logoFallback) ? logoFallback : null;

      if (resolvedLogo) {
        try {
          const logo = await sharp(resolvedLogo)
            .resize({ width: 80, height: 80, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png().toBuffer();
          compositeOps.push({ input: logo, top: 18, left: 24 });
        } catch { /* ignore */ }
      }

      // ── Composite item thumbnails ─────────────────────────────────
      const allSlots = [
        ...leftItems.map((item, i) => ({ item, x: padX, y: leftSlotY(i) })),
        ...rightItems.map((item, i) => ({ item, x: rightColLeft + colW - thumbSize - 4, y: leftSlotY(i) })),
      ];

      for (const { item, x, y } of allSlots) {
        if (!item) continue;
        const buf = imgCache.get(item.id);
        if (!buf) continue;
        try {
          const thumb = await sharp(buf)
            .resize({ width: thumbSize, height: thumbSize, fit: 'cover' })
            .composite([{
              input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${thumbSize}" height="${thumbSize}" rx="12"/></svg>`),
              blend: 'dest-in',
            }])
            .png().toBuffer();
          compositeOps.push({ input: thumb, top: y, left: Math.max(0, x) });
        } catch { /* ignore */ }
      }

      return await sharp({
        create: { width: S, height: S, channels: 4, background: { r: 5, g: 13, b: 26, alpha: 1 } },
      })
        .composite(compositeOps)
        .png()
        .toBuffer();

    } catch (error) {
      this.logger.error('Error generating bracket image', error);
      throw error;
    }
  }

  async saveImageLocally(buffer: Buffer, bracketId: string, round: number): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public', 'brackets');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `bracket-${bracketId}-r${round}-${Date.now()}.png`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    const baseUrl = process.env.BACKEND_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
    return `${baseUrl}/brackets/${filename}`;
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 });
    return Buffer.from(r.data, 'binary');
  }

  private truncateXml(text: string, len: number): string {
    const e = this.escapeXml(text);
    return e.length <= len ? e : e.substring(0, len) + '...';
  }

  private escapeXml(s: string): string {
    return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] ?? c));
  }
}
