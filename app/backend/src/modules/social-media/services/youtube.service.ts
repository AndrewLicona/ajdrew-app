import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Configurar ruta de ffmpeg explícitamente para evitar ENOENT
if (ffmpegStatic) {
    // Log the path to help debug
    console.log(`[FFMPEG] Path found: ${ffmpegStatic}`);
    ffmpeg.setFfmpegPath(ffmpegStatic);
}

@Injectable()
export class YoutubeService {
    private readonly logger = new Logger(YoutubeService.name);
    private oauth2Client: any;

    constructor(private prisma: PrismaService) {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );
    }

    async publishPhaseAnnouncement(bracketId: string, round: number, imageUrl: string) {
        const accounts = await this.prisma.youtubeAccount.findMany({
            where: { isActive: true }
        });

        if (accounts.length === 0) return;

        const videoPath = await this.createVideoFromImage(imageUrl, bracketId, round);

        try {
            for (const account of accounts) {
                await this.uploadToYoutube(
                    account,
                    videoPath,
                    `Elite Rankings - Ronda ${round} ha comenzado en ${bracketId}`,
                    `La Ronda ${round} ha comenzado en Elite Rankings para el torneo ${bracketId}. ¡Ven a votar!`,
                    bracketId,
                    round
                );
            }

            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }

        } catch (error: any) {
            this.logger.error(`Error in YouTube publication process: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async createVideoFromImage(imageUrl: string, bracketId: string, round: number): Promise<string> {
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const outputPath = path.join(tempDir, `yt_${bracketId}_r${round}.mp4`);

        return new Promise((resolve, reject) => {
            const isLocalBracket = imageUrl.includes('/brackets/');
            const inputPath = isLocalBracket
                ? imageUrl.replace(/.*\/brackets\//, path.join(process.cwd(), 'public', 'brackets', ''))
                : imageUrl;

            this.logger.log(`Creating video from image. Input: ${inputPath}, Output: ${outputPath}`);

            ffmpeg(inputPath)
                .inputOptions(['-loop 1', '-t 5'])
                .outputOptions([
                    '-c:v libx264',
                    '-t 5',
                    '-pix_fmt yuv420p',
                    '-vf scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black'
                ])
                .on('start', (commandLine) => {
                    this.logger.log(`Spawned ffmpeg with command: ${commandLine}`);
                })
                .on('end', () => {
                    this.logger.log(`Video created successfully: ${outputPath}`);
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    this.logger.error(`FFMPEG Error: ${err.message}`);
                    reject(err);
                })
                .save(outputPath);
        });
    }

    private async uploadToYoutube(account: any, videoPath: string, title: string, description: string, bracketId: string, round: number) {
        try {
            this.oauth2Client.setCredentials({
                access_token: account.accessToken,
                refresh_token: account.refreshToken
            });

            const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });

            const response = await youtube.videos.insert({
                part: ['snippet', 'status'],
                requestBody: {
                    snippet: {
                        title,
                        description,
                        tags: ['EliteRankings', 'Torneo', 'Bracket'],
                        categoryId: '20',
                    },
                    status: {
                        privacyStatus: 'public',
                        selfDeclaredMadeForKids: false,
                    },
                },
                media: {
                    body: fs.createReadStream(videoPath),
                },
            });

            if (response.data.id) {
                this.logger.log(`YouTube Insert Response: ${JSON.stringify(response.data.status)}`);

                if (bracketId !== 'TEST') {
                    await this.prisma.youtubePublication.create({
                        data: {
                            accountId: account.id,
                            bracketId,
                            round,
                            videoId: response.data.id,
                            status: 'published',
                            publishedAt: new Date()
                        }
                    });
                }

                this.logger.log(`Uploaded video to YouTube: https://youtu.be/${response.data.id} for account ${account.name}`);
                return response.data;
            }
            return null;
        } catch (error: any) {
            this.logger.error(`YouTube upload failed for ${account.name}: ${error.message}`);

            if (bracketId !== 'TEST') {
                await this.prisma.youtubePublication.create({
                    data: {
                        accountId: account.id,
                        bracketId,
                        round,
                        status: 'failed',
                        error: error.message
                    }
                });
            }
            throw error;
        }
    }

    async getAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtube.readonly'
            ],
        });
    }

    async handleCallback(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);

        const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
        const channelRes = await youtube.channels.list({
            part: ['snippet'],
            mine: true
        });

        const channel = channelRes.data.items?.[0];
        if (!channel) throw new Error('Channel not found');

        return this.prisma.youtubeAccount.create({
            data: {
                name: channel.snippet?.title || 'Mi Canal de YouTube',
                channelId: channel.id!,
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token!,
                expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
            }
        });
    }

    async testAccountUpload(accountId: string) {
        const account = await this.prisma.youtubeAccount.findUnique({
            where: { id: accountId }
        });

        if (!account) throw new Error('Account not found');

        const testImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200";
        const videoPath = await this.createVideoFromImage(testImage, 'TEST', 0);

        try {
            const result = await this.uploadToYoutube(
                account,
                videoPath,
                "Elite Rankings - Test Upload",
                "Prueba de automatización de Elite Rankings.",
                "TEST",
                0
            );

            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            return result;
        } catch (error) {
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            throw error;
        }
    }
}
