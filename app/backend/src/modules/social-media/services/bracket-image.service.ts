import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { existsSync } from 'fs';

@Injectable()
export class BracketImageService {
  private readonly logger = new Logger(BracketImageService.name);

  constructor(private prisma: PrismaService) { }

  async generateBracketImage(bracketId: string, round: number): Promise<Buffer> {
    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: bracketId },
        include: { matches: { where: { ronda: round }, take: 4, include: { itemA: true, itemB: true } } }
      });

      if (!bracket) throw new Error('Bracket not found');

      // Create base canvas 1200x630 (Discord/Social standard)
      const width = 1200;
      const height = 630;

      // Load or create background
      // Ideally load a template image, for now plain dark background
      let compositeOperations: sharp.OverlayOptions[] = [
        {
          input: {
            create: {
              width,
              height,
              channels: 4,
              background: { r: 10, g: 10, b: 10, alpha: 1 } // #0a0a0a
            }
          }
        }
      ];

      // Add Title
      const titleSvg = Buffer.from(`
        <svg width="${width}" height="100">
          <style>
            .title { fill: white; font-size: 48px; font-family: sans-serif; font-weight: bold; text-transform: uppercase; }
            .subtitle { fill: #22c55e; font-size: 24px; font-family: sans-serif; font-weight: bold; letter-spacing: 0.2em; }
          </style>
          <text x="50%" y="40" text-anchor="middle" class="subtitle">NUEVA RONDA DE VOTACIÓN</text>
          <text x="50%" y="90" text-anchor="middle" class="title">${bracket.tematica}</text>
        </svg>
      `);
      compositeOperations.push({ input: titleSvg, top: 40, left: 0 });

      // Add Round Info
      const roundSvg = Buffer.from(`
        <svg width="${width}" height="60">
          <style>
            .round { fill: rgba(255,255,255,0.6); font-size: 32px; font-family: sans-serif; font-weight: bold; }
          </style>
          <text x="50%" y="40" text-anchor="middle" class="round">RONDA ${round} - EN VIVO</text>
        </svg>
      `);
      compositeOperations.push({ input: roundSvg, top: 150, left: 0 });

      // Render Matches (Limit to 4 for visibility)
      // We will place them in a 2x2 grid if 4, or 1x2 if 2, etc.
      const matches = bracket.matches;
      if (matches.length > 0) {
        // Mocking item images for lines (in real impl we would fetch item images)
        // For MVP we just render text names of matches

        let matchY = 250;
        const cardHeight = 120;
        const gap = 20;

        // Create SVG for matches list
        const matchesSvgString = matches.map((m, idx) => {
          const yPos = idx * (cardHeight + gap);
          const nameA = m.itemA?.nombre || '???';
          const nameB = m.itemB?.nombre || '???';

          return `
             <g transform="translate(100, ${yPos})">
               <!-- Card Bg -->
               <rect x="0" y="0" width="1000" height="${cardHeight}" rx="20" fill="#1a1a1a" stroke="#333" stroke-width="2" />
               
               <!-- Names -->
               <text x="50" y="70" fill="white" font-size="36" font-family: sans-serif; font-weight: bold>${nameA}</text>
               <text x="500" y="70" fill="#22c55e" font-size="40" font-family: sans-serif; font-weight: bold" text-anchor="middle">VS</text>
               <text x="950" y="70" fill="white" font-size="36" font-family: sans-serif; font-weight: bold" text-anchor="end">${nameB}</text>

               <!-- Votes (Small) -->
               <text x="50" y="100" fill="#666" font-size="18" font-family: sans-serif>${m.votosA} votos</text>
               <text x="950" y="100" fill="#666" font-size="18" font-family: sans-serif" text-anchor="end">${m.votosB} votos</text>
             </g>
           `;
        }).join('');

        const matchesSvg = Buffer.from(`
          <svg width="${width}" height="${(cardHeight + gap) * matches.length}">
            ${matchesSvgString}
          </svg>
        `);
        compositeOperations.push({ input: matchesSvg, top: matchY, left: 0 });
      }

      // Branding Footer
      const footerSvg = Buffer.from(`
        <svg width="${width}" height="60">
           <rect x="0" y="0" width="${width}" height="60" fill="#22c55e" />
           <text x="50%" y="40" text-anchor="middle" fill="black" font-size="24" font-family: sans-serif; font-weight: bold>¡ENTRA Y VOTA AHORA! bit.ly/torneosity</text>
        </svg>
      `);
      compositeOperations.push({ input: footerSvg, top: height - 60, left: 0 });

      // Final Composition
      const finalImage = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r: 10, g: 10, b: 10, alpha: 1 }
        }
      })
        .composite(compositeOperations)
        .png()
        .toBuffer();

      return finalImage;

    } catch (error) {
      this.logger.error('Error generating bracket image', error);
      throw error;
    }
  }

  async saveImageLocally(buffer: Buffer, bracketId: string, round: number): Promise<string> {
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'brackets');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `bracket-${bracketId}-r${round}-${Date.now()}.png`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const baseUrl = process.env.BACKEND_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
    return `${baseUrl}/brackets/${filename}`;
  }
}
