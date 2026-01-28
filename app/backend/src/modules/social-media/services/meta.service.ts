import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class MetaService {
    private readonly logger = new Logger(MetaService.name);
    private readonly graphBaseUrl = 'https://graph.facebook.com/v19.0';

    constructor(private prisma: PrismaService) { }

    async publishPhaseAnnouncement(
        bracketId: string,
        round: number,
        imageUrl: string
    ) {
        try {
            const bracket = await this.prisma.votacionBracket.findUnique({
                where: { id: bracketId },
                include: { juego: true }
            });

            if (!bracket) return;

            const text = this.buildPostText(bracket, round);

            // 1. Post to Facebook Pages
            const fbAccounts = await this.prisma.facebookAccount.findMany({ where: { isActive: true } });
            for (const account of fbAccounts) {
                await this.postToFacebook(account, text, imageUrl, bracketId, round);
            }

            // 2. Post to Instagram Accounts
            const igAccounts = await this.prisma.instagramAccount.findMany({ where: { isActive: true } });
            for (const account of igAccounts) {
                await this.postToInstagram(account, text, imageUrl, bracketId, round);
            }

        } catch (error) {
            this.logger.error('Error in Meta publication process', error);
        }
    }

    async testFacebook(accountId: string) {
        const account = await this.prisma.facebookAccount.findUnique({ where: { id: accountId } });
        if (!account) throw new Error('Account not found');

        const testText = "🚀 Prueba de conexión automática desde Elite Rankings.\n\nEste es un mensaje de verificación para confirmar que Facebook está correctamente vinculado.";
        const testImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"; // Gaming image

        return this.postToFacebook(account, testText, testImage, null, 0);
    }

    async testInstagram(accountId: string) {
        const account = await this.prisma.instagramAccount.findUnique({ where: { id: accountId } });
        if (!account) throw new Error('Account not found');

        const testText = "🎮 Prueba de conexión - Elite Rankings\n\nVerificando vinculación con Instagram Professional API. #EliteRankings #Testing";
        const testImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200";

        return this.postToInstagram(account, testText, testImage, null, 0);
    }

    private buildPostText(bracket: any, round: number): string {
        const gameEmoji = bracket.juego?.nombre?.includes('FC') ? '⚽' : '🎮';
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        return `${gameEmoji} ¡NUEVA RONDA! ${bracket.tematica}\n\n` +
            `🔥 La Ronda ${round} ha comenzado en Elite Rankings.\n\n` +
            `🗳️ ¡Entra y vota por tus favoritos ahora!\n` +
            `${frontendUrl}/votaciones/${bracket.slug}\n\n` +
            `#EliteRankings #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`;
    }

    private async postToFacebook(account: any, text: string, imageUrl: string, bracketId: string | null, round: number) {
        try {
            const response = await axios.post(`${this.graphBaseUrl}/${account.pageId}/photos`, {
                url: imageUrl,
                message: text,
                access_token: account.pageAccessToken
            });

            if (response.data?.id) {
                // Only log to database if it's a real bracket (not a test)
                if (bracketId) {
                    await this.prisma.metaPublication.create({
                        data: {
                            platform: 'facebook',
                            facebookAccountId: account.id,
                            bracketId,
                            round,
                            postId: response.data.id,
                            imageUrl,
                            status: 'published',
                            publishedAt: new Date()
                        }
                    });
                }
                this.logger.log(`Posted to Facebook Page: ${account.name}`);
                return { success: true, message: 'Publicado en Facebook correctamente' };
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            this.logger.error(`Facebook post failed for ${account.name}: ${errorMsg}`);
            // Only log errors to database if it's a real bracket
            if (bracketId) {
                await this.prisma.metaPublication.create({
                    data: {
                        platform: 'facebook',
                        facebookAccountId: account.id,
                        bracketId,
                        round,
                        imageUrl,
                        status: 'failed',
                        error: errorMsg
                    }
                });
            }
            throw new Error(`Error de Meta API: ${errorMsg}`);
        }
    }

    private async postToInstagram(account: any, text: string, imageUrl: string, bracketId: string | null, round: number) {
        try {
            // Instagram is a 2-step process: Container -> Publish

            // 1. Create Media Container
            const containerResponse = await axios.post(`${this.graphBaseUrl}/${account.igAccountId}/media`, {
                image_url: imageUrl,
                caption: text,
                access_token: account.pageAccessToken
            });

            const creationId = containerResponse.data?.id;
            if (!creationId) throw new Error('Failed to create IG media container');

            // 2. Publish Media
            const publishResponse = await axios.post(`${this.graphBaseUrl}/${account.igAccountId}/media_publish`, {
                creation_id: creationId,
                access_token: account.pageAccessToken
            });

            if (publishResponse.data?.id) {
                // Only log to database if it's a real bracket (not a test)
                if (bracketId) {
                    await this.prisma.metaPublication.create({
                        data: {
                            platform: 'instagram',
                            instagramAccountId: account.id,
                            bracketId,
                            round,
                            postId: publishResponse.data.id,
                            imageUrl,
                            status: 'published',
                            publishedAt: new Date()
                        }
                    });
                }
                this.logger.log(`Posted to Instagram: ${account.name}`);
                return { success: true, message: 'Publicado en Instagram correctamente' };
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            this.logger.error(`Instagram post failed for ${account.name}: ${errorMsg}`);
            // Only log errors to database if it's a real bracket
            if (bracketId) {
                await this.prisma.metaPublication.create({
                    data: {
                        platform: 'instagram',
                        instagramAccountId: account.id,
                        bracketId,
                        round,
                        imageUrl,
                        status: 'failed',
                        error: errorMsg
                    }
                });
            }
            throw new Error(`Error de Meta API: ${errorMsg}`);
        }
    }
}
