import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import axios from 'axios';

export interface RankingItemMeta {
    itemName: string;
    itemImage?: string;
    averageRating: number;
}

@Injectable()
export class RankingImageGenerator {
    constructor() {}

    async generateRankingImage(title: string, topItems: RankingItemMeta[]): Promise<Buffer> {
        const width = 1200;
        const height = 630;
        
        // Base dark background
        const background = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 15, g: 15, b: 20, alpha: 1 }
            }
        }).png().toBuffer();

        // SVG Overlay for text and decorative boxes
        let svgElements = '';
        
        // Background decorative gradient (simulated with SVG)
        svgElements += `
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgb(40,40,60);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(10,10,15);stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1200" height="630" fill="url(#grad1)" opacity="0.6"/>
        `;

        // Title
        svgElements += `
            <text x="600" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff" text-anchor="middle">
                ${this.escapeXml(title)}
            </text>
            <text x="600" y="130" font-family="Arial, sans-serif" font-size="24" fill="#66ccff" text-anchor="middle" letter-spacing="4">
                TOP CALIFICACIONES
            </text>
            <line x1="100" y1="160" x2="1100" y2="160" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
        `;

        const compositeOperations: sharp.OverlayOptions[] = [];

        // Add top items
        const maxItems = Math.min(topItems.length, 3);
        const cardWidth = 320;
        const spacing = 40;
        const totalWidth = (maxItems * cardWidth) + ((maxItems - 1) * spacing);
        const startX = (width - totalWidth) / 2;
        const cardY = 200;

        for (let i = 0; i < maxItems; i++) {
            const item = topItems[i];
            const currentX = startX + (i * (cardWidth + spacing));
            
            // Draw card background
            svgElements += `
                <rect x="${currentX}" y="${cardY}" width="${cardWidth}" height="350" rx="20" ry="20" fill="#111111" stroke="#333333" stroke-width="2"/>
                <circle cx="${currentX + cardWidth / 2}" cy="${cardY - 20}" r="24" fill="#ffaa00" stroke="#222" stroke-width="4" />
                <text x="${currentX + cardWidth / 2}" y="${cardY - 12}" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#000000" text-anchor="middle">
                    #${i + 1}
                </text>
                <text x="${currentX + cardWidth / 2}" y="${cardY + 280}" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">
                    ${this.truncateText(item.itemName, 22)}
                </text>
                <text x="${currentX + cardWidth / 2}" y="${cardY + 315}" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffaa00" text-anchor="middle">
                    ★ ${item.averageRating.toFixed(1)}
                </text>
            `;

            // Download and composite item image
            try {
                if (item.itemImage) {
                    const imgBuffer = await this.downloadImage(item.itemImage);
                    const resizedImg = await sharp(imgBuffer)
                        .resize({ width: 280, height: 280, fit: 'cover' })
                        .composite([{
                            input: Buffer.from('<svg><rect x="0" y="0" width="280" height="280" rx="16" ry="16"/></svg>'),
                            blend: 'dest-in'
                        }])
                        .png()
                        .toBuffer();

                    compositeOperations.push({
                        input: resizedImg,
                        top: cardY + 20,
                        left: Math.round(currentX + 20),
                    });
                }
            } catch (error) {
                console.error('Failed to download/process image for OG generator:', item.itemImage, error);
            }
        }

        const svgBuffer = Buffer.from(`<svg width="${width}" height="${height}">${svgElements}</svg>`);
        
        compositeOperations.unshift({
            input: svgBuffer,
            top: 0,
            left: 0
        });

        // Add branding
        const brandingSvg = Buffer.from(`
            <svg width="1200" height="630">
                <text x="600" y="600" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" opacity="0.4" font-style="italic" font-weight="bold" text-anchor="middle">
                    AJDREW.COM
                </text>
            </svg>
        `);
        
        compositeOperations.push({ input: brandingSvg, top: 0, left: 0 });

        const finalImage = await sharp(background)
            .composite(compositeOperations)
            .png()
            .toBuffer();

        return finalImage;
    }

    private truncateText(text: string, length: number): string {
        const escaped = this.escapeXml(text);
        if (escaped.length <= length) return escaped;
        return escaped.substring(0, length) + '...';
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }

    private async downloadImage(url: string): Promise<Buffer> {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    }
}
