import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { XService } from '../services/x.service';

@Controller('admin/x')
export class AdminXController {
    constructor(
        private prisma: PrismaService,
        private xService: XService
    ) { }

    @Get('accounts')
    async getAccounts() {
        return this.prisma.xAccount.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    @Post('accounts')
    async createAccount(@Body() body: {
        name: string;
        apiKey: string;
        apiSecret: string;
        accessToken: string;
        accessSecret: string
    }) {
        return this.prisma.xAccount.create({
            data: {
                ...body,
                isActive: true
            }
        });
    }

    @Delete('accounts/:id')
    async deleteAccount(@Param('id') id: string) {
        return this.prisma.xAccount.delete({
            where: { id }
        });
    }

    @Post('accounts/:id/test')
    async testAccount(@Param('id') id: string) {
        try {
            return await this.xService.testTweet(id);
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}
