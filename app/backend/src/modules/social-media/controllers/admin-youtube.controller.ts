import { Controller, Get, Post, Body, Delete, Param, Query, Res } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { YoutubeService } from '../services/youtube.service';
import { Response } from 'express';

@Controller('admin/social/youtube')
export class AdminYoutubeController {
    constructor(
        private prisma: PrismaService,
        private youtubeService: YoutubeService
    ) { }

    @Get('accounts')
    async getAccounts() {
        const accounts = await this.prisma.youtubeAccount.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Transform BigInt to Number/String for JSON serialization
        return accounts.map(acc => ({
            ...acc,
            expiryDate: acc.expiryDate ? Number(acc.expiryDate) : null
        }));
    }

    @Delete('accounts/:id')
    async deleteAccount(@Param('id') id: string) {
        return this.prisma.youtubeAccount.delete({ where: { id } });
    }

    @Get('auth-url')
    async getAuthUrl() {
        const url = await this.youtubeService.getAuthUrl();
        return { url };
    }

    @Get('callback')
    async handleCallback(@Query('code') code: string, @Res() res: Response) {
        try {
            await this.youtubeService.handleCallback(code);
            // Redirect back to frontend admin page
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            return res.redirect(`${frontendUrl}/admin/youtube?success=true`);
        } catch (error: any) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            return res.redirect(`${frontendUrl}/admin/youtube?error=${error.message}`);
        }
    }

    @Post('accounts/:id/test')
    async testUpload(@Param('id') id: string) {
        try {
            const result: any = await this.youtubeService.testAccountUpload(id);
            return {
                success: true,
                message: 'Video subido correctamente.',
                videoUrl: `https://www.youtube.com/watch?v=${result?.videoId || ''}`
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Error al subir el video: ${error.message}`
            };
        }
    }
}
