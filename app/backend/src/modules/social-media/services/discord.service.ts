import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BracketImageService } from './bracket-image.service';

interface DiscordEmbed {
    title: string;
    description: string;
    color: number;
    fields?: { name: string; value: string; inline?: boolean }[];
    image?: { url: string };
    thumbnail?: { url: string };
    footer?: { text: string };
    url?: string;
    timestamp?: string;
}

@Injectable()
export class DiscordService {
    private readonly logger = new Logger(DiscordService.name);

    constructor(
        private prisma: PrismaService,
        private imageService: BracketImageService
    ) { }

    async publishPhaseAnnouncement(
        bracketId: string,
        round: number,
        imageBuffer: Buffer
    ) {
        try {
            const bracket = await this.prisma.votacionBracket.findUnique({
                where: { id: bracketId },
                include: {
                    matches: { where: { ronda: round } },
                    juego: true
                }
            });

            if (!bracket) {
                this.logger.error(`Bracket not found: ${bracketId}`);
                return;
            }

            // 1. Upload image to temporary storage
            const imageUrl = await this.imageService.saveImageLocally(imageBuffer, bracketId, round);

            // 2. Build Discord embed
            const embed = this.buildEmbed(bracket, round, imageUrl);

            // 3. Send to all active webhooks (DB + ENV)
            const dbWebhooks = await this.prisma.discordWebhook.findMany({
                where: { isActive: true }
            });

            // Get webhooks from environment variables (comma separated)
            const envWebhookUrls = (process.env.DISCORD_WEBHOOK_URLS || '')
                .split(',')
                .map(url => url.trim())
                .filter(url => url.startsWith('https://discord.com/api/webhooks/'));

            this.logger.log(`Publishing update for bracket ${bracket.slug} round ${round} to ${dbWebhooks.length} DB webhooks and ${envWebhookUrls.length} ENV webhooks`);

            // 4. Send to DB webhooks
            for (const webhook of dbWebhooks) {
                await this.sendToWebhook(webhook.webhookUrl, embed, bracketId, round, webhook.id);
            }

            // 5. Send to ENV webhooks
            for (const url of envWebhookUrls) {
                await this.sendToWebhook(url, embed, bracketId, round, 'ENV_WEBHOOK');
            }
        } catch (error) {
            this.logger.error('Error publishing phase announcement', error);
        }
    }

    private buildEmbed(bracket: any, round: number, imageUrl: string): DiscordEmbed {
        const matchCount = bracket.matches.length;
        const gameInfo = bracket.juego?.nombre || 'General';
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        return {
            title: `🏆 Nueva Ronda - ${bracket.tematica}`,
            description: `**Ronda ${round}** ha comenzado. ¡Vota por tus favoritos!`,
            color: 0x22c55e, // Verde primary
            fields: [
                { name: '🎮 Juego', value: gameInfo, inline: true },
                { name: '⚔️ Combates', value: `${matchCount} enfrentamientos`, inline: true },
                { name: '📊 Estado', value: 'EN VIVO 🟢', inline: true }
            ],
            image: { url: imageUrl },
            footer: { text: '¡Tu voto decide el campeón!' },
            url: `${frontendUrl}/votaciones/${bracket.slug}`,
            timestamp: new Date().toISOString()
        };
    }

    private async sendToWebhook(
        webhookUrl: string,
        embed: DiscordEmbed,
        bracketId: string,
        round: number,
        webhookId: string
    ) {
        try {
            // Decrypt webhook URL if encrypted (assuming plain for MVP first step)
            const decryptedUrl = webhookUrl;

            const response = await fetch(decryptedUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });

            if (response.ok) {
                // Try to get message ID if returned, usually Discord webhook returns 204 No Content unless wait=true
                // We handle standard fire-and-forget
                await this.prisma.discordPublication.create({
                    data: {
                        webhookId,
                        bracketId,
                        round,
                        imageUrl: embed.image?.url,
                        status: 'published',
                        publishedAt: new Date()
                    }
                });
                this.logger.log(`Published to webhook ${webhookId}`);
            } else {
                throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
            }
        } catch (error: any) {
            await this.prisma.discordPublication.create({
                data: {
                    webhookId,
                    bracketId,
                    round,
                    status: 'failed',
                    error: error.message
                }
            });
            this.logger.error(`Failed to publish to webhook ${webhookId}: ${error.message}`);
        }
    }
}
