import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { XService } from '../services/x.service';

@Controller('admin/x')
export class AdminXController {
  constructor(
    private prisma: PrismaService,
    private xService: XService,
  ) {}

  @Get('accounts')
  async getAccounts() {
    return this.prisma.xAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('accounts')
  async createAccount(
    @Body()
    body: {
      name: string;
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessSecret: string;
    },
  ) {
    return this.prisma.xAccount.create({
      data: {
        ...body,
        isActive: true,
      },
    });
  }

  @Patch('accounts/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      apiKey?: string;
      apiSecret?: string;
      accessToken?: string;
      accessSecret?: string;
      isActive?: boolean;
    },
  ) {
    const data: Record<string, string | boolean> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.apiKey !== undefined) data.apiKey = body.apiKey;
    if (body.apiSecret !== undefined) data.apiSecret = body.apiSecret;
    if (body.accessToken !== undefined) data.accessToken = body.accessToken;
    if (body.accessSecret !== undefined) data.accessSecret = body.accessSecret;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    return this.prisma.xAccount.update({ where: { id }, data });
  }

  @Delete('accounts/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.prisma.xAccount.delete({
      where: { id },
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
