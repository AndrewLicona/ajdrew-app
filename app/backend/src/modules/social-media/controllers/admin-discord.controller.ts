import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DiscordService } from '../services/discord.service';
// import { AdminGuard } from '@/auth/guards/admin.guard'; // Uncomment when Auth is ready

@Controller('admin/discord')
// @UseGuards(AdminGuard)
export class AdminDiscordController {
  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
  ) {}

  @Get('webhooks')
  async getWebhooks() {
    return this.prisma.discordWebhook.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('webhooks')
  async createWebhook(@Body() body: { name: string; webhookUrl: string }) {
    return this.prisma.discordWebhook.create({
      data: {
        name: body.name,
        webhookUrl: body.webhookUrl,
        isActive: true,
      },
    });
  }

  @Delete('webhooks/:id')
  async deleteWebhook(@Param('id') id: string) {
    return this.prisma.discordWebhook.delete({
      where: { id },
    });
  }

  @Post('webhooks/:id/test')
  async testWebhook(@Param('id') id: string) {
    const webhook = await this.prisma.discordWebhook.findUnique({
      where: { id },
    });
    if (!webhook) throw new Error('Webhook not found');

    const testEmbed = {
      title: '🧪 Test de Integración Discord',
      description: 'Si ves esto, la conexión está funcionando correctamente.',
      color: 0x5865f2,
      footer: { text: 'Configuración Elite Rankings' },
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhook.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [testEmbed] }),
    });

    return { success: response.ok };
  }
}
