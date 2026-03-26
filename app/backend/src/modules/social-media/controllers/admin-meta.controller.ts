import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MetaService } from '../services/meta.service';

@Controller('admin/social/meta')
export class AdminMetaController {
  constructor(
    private prisma: PrismaService,
    private metaService: MetaService,
  ) {}

  // Facebook Pages
  @Get('facebook/accounts')
  async getFacebookAccounts() {
    try {
      return await this.prisma.facebookAccount.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      return [];
    }
  }

  @Post('facebook/accounts')
  async createFacebookAccount(@Body() body: any) {
    try {
      const { name, pageId, pageAccessToken } = body;
      return await this.prisma.facebookAccount.create({
        data: { name, pageId, pageAccessToken },
      });
    } catch (error: any) {
      console.error('Error creating Facebook account:', error);
      return { success: false, message: error.message };
    }
  }

  @Delete('facebook/accounts/:id')
  async deleteFacebookAccount(@Param('id') id: string) {
    return this.prisma.facebookAccount.delete({ where: { id } });
  }

  @Post('facebook/:id/test')
  async testFacebook(@Param('id') id: string) {
    try {
      return await this.metaService.testFacebook(id);
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Instagram Accounts
  @Get('instagram/accounts')
  async getInstagramAccounts() {
    try {
      return await this.prisma.instagramAccount.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      return [];
    }
  }

  @Post('instagram/accounts')
  async createInstagramAccount(@Body() body: any) {
    try {
      const { name, igAccountId, pageAccessToken } = body;
      return await this.prisma.instagramAccount.create({
        data: { name, igAccountId, pageAccessToken },
      });
    } catch (error: any) {
      console.error('Error creating Instagram account:', error);
      return { success: false, message: error.message };
    }
  }

  @Delete('instagram/accounts/:id')
  async deleteInstagramAccount(@Param('id') id: string) {
    return this.prisma.instagramAccount.delete({ where: { id } });
  }

  @Post('instagram/:id/test')
  async testInstagram(@Param('id') id: string) {
    try {
      return await this.metaService.testInstagram(id);
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
