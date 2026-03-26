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
    private imageService: BracketImageService,
  ) {}

  private async getActiveWebhooks(): Promise<{ url: string; id: string }[]> {
    const dbWebhooks = await this.prisma.discordWebhook.findMany({
      where: { isActive: true },
    });

    const envUrls = (process.env.DISCORD_WEBHOOK_URLS || '')
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.startsWith('https://discord.com/api/webhooks/'));

    const webhooks = dbWebhooks.map((w) => ({ url: w.webhookUrl, id: w.id }));

    for (const url of envUrls) {
      if (!webhooks.some((w) => w.url === url)) {
        webhooks.push({ url, id: 'ENV_WEBHOOK' });
      }
    }

    return webhooks;
  }

  async publishTutorial(tutorial: any, text: string, imageUrl: string) {
    try {
      const webhooks = await this.getActiveWebhooks();
      const embed = this.buildTutorialEmbed(tutorial, imageUrl);

      for (const webhook of webhooks) {
        await this.sendToWebhook(
          webhook.url,
          embed,
          'tutorial',
          tutorial.id,
          webhook.id,
        );
      }

      this.logger.log(`Tutorial published to ${webhooks.length} Discord webhooks`);
    } catch (error) {
      this.logger.error('Error publishing tutorial to Discord', error);
    }
  }

  async publishSorteoCreated(sorteo: any, text: string, imageBuffer: Buffer) {
    try {
      const webhooks = await this.getActiveWebhooks();

      // Guardar imagen temporalmente
      const imageUrl = await this.imageService.saveImageLocally(
        imageBuffer,
        sorteo.id,
        0,
      );
      const embed = this.buildSorteoEmbed(sorteo, imageUrl, 'created');

      for (const webhook of webhooks) {
        await this.sendToWebhook(
          webhook.url,
          embed,
          'sorteo',
          sorteo.id,
          webhook.id,
        );
      }

      this.logger.log(`Sorteo created published to ${webhooks.length} Discord webhooks`);
    } catch (error) {
      this.logger.error('Error publishing sorteo created to Discord', error);
    }
  }

  async publishSorteoWinners(
    sorteo: any,
    text: string,
    imageBuffer: Buffer,
    winnerNames: string[],
  ) {
    try {
      const webhooks = await this.getActiveWebhooks();

      const imageUrl = await this.imageService.saveImageLocally(
        imageBuffer,
        sorteo.id,
        0,
      );
      const embed = this.buildSorteoEmbed(
        sorteo,
        imageUrl,
        'winners',
        winnerNames,
      );

      for (const webhook of webhooks) {
        await this.sendToWebhook(
          webhook.url,
          embed,
          'sorteo',
          sorteo.id,
          webhook.id,
        );
      }

      this.logger.log(`Sorteo winners published to ${webhooks.length} Discord webhooks`);
    } catch (error) {
      this.logger.error('Error publishing sorteo winners to Discord', error);
    }
  }

  async publishRanking(categoria: any, text: string, imageUrl: string) {
    try {
      const webhooks = await this.getActiveWebhooks();
      const embed = this.buildRankingEmbed(categoria, imageUrl);

      for (const webhook of webhooks) {
        await this.sendToWebhook(
          webhook.url,
          embed,
          'ranking',
          categoria.id,
          webhook.id,
        );
      }

      this.logger.log(`Ranking published to ${webhooks.length} Discord webhooks`);
    } catch (error) {
      this.logger.error('Error publishing ranking to Discord', error);
    }
  }

  private buildTutorialEmbed(tutorial: any, imageUrl: string): DiscordEmbed {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return {
      title: `📚 ${tutorial.titulo}`,
      description:
        tutorial.descripcion?.slice(0, 500) || 'Nuevo tutorial disponible',
      color: 0x22c55e,
      fields: [
        {
          name: '🎮 Juego',
          value: tutorial.juego?.nombre || 'General',
          inline: true,
        },
        {
          name: '👤 Autor',
          value: tutorial.author?.nombre || 'Admin',
          inline: true,
        },
        { name: '📊 Estado', value: 'PUBLICADO 🟢', inline: true },
      ],
      image: imageUrl ? { url: imageUrl } : undefined,
      footer: { text: 'Aprende con AJDREW' },
      url: `${frontendUrl}/tutoriales/${tutorial.slug}`,
      timestamp: new Date().toISOString(),
    };
  }

  private buildSorteoEmbed(
    sorteo: any,
    imageUrl: string,
    type: 'created' | 'winners',
    winnerNames?: string[],
  ): DiscordEmbed {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const diasRestantes = Math.ceil(
      (sorteo.fechaFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (type === 'winners') {
      return {
        title: `🏆 Ganadores: ${sorteo.titulo}`,
        description: `✨ **Ganadores:**\n${winnerNames?.join('\n') || 'Ver en la web'}`,
        color: 0xffd700,
        fields: [
          { name: '🎁 Premio', value: sorteo.premio, inline: false },
          {
            name: '🎮 Juego',
            value: sorteo.juego?.nombre || 'General',
            inline: true,
          },
          { name: '📊 Estado', value: 'FINALIZADO ✅', inline: true },
        ],
        image: { url: imageUrl },
        footer: { text: '¡Felicidades a los ganadores!' },
        url: `${frontendUrl}/sorteos/${sorteo.id}`,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      title: `🎁 ${sorteo.titulo}`,
      description: `**Premio:** ${sorteo.premio}\n\n⏰ Faltan **${diasRestantes}** días`,
      color: 0x9b59b6,
      fields: [
        {
          name: '🎮 Juego',
          value: sorteo.juego?.nombre || 'General',
          inline: true,
        },
        { name: '📊 Estado', value: 'ACTIVO 🟢', inline: true },
        { name: '🎟️ Participantes', value: '¡Participa ahora!', inline: true },
      ],
      image: { url: imageUrl },
      footer: { text: '¡No te lo pierdas!' },
      url: `${frontendUrl}/sorteos/${sorteo.id}`,
      timestamp: new Date().toISOString(),
    };
  }

  private buildRankingEmbed(categoria: any, imageUrl: string): DiscordEmbed {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return {
      title: `📊 Ranking: ${categoria.nombre}`,
      description: 'Top calificaciones actualizado',
      color: 0x3498db,
      fields: [
        {
          name: '🎮 Juego',
          value: categoria.juego?.nombre || 'General',
          inline: true,
        },
        {
          name: '📊 Items',
          value: `${categoria.items?.length || 0} calificados`,
          inline: true,
        },
        { name: '🏆 Estado', value: 'ACTUALIZADO 🟢', inline: true },
      ],
      image: { url: imageUrl },
      footer: { text: 'Consulta el ranking completo' },
      url: `${frontendUrl}/calificaciones/${categoria.id}`,
      timestamp: new Date().toISOString(),
    };
  }

  async publishPhaseAnnouncement(
    bracketId: string,
    round: number,
    imageUrl: string,
  ) {
    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: bracketId },
        include: {
          matches: { where: { ronda: round } },
          juego: true,
        },
      });

      if (!bracket) {
        this.logger.error(`Bracket not found: ${bracketId}`);
        return;
      }

      const embed = this.buildEmbed(bracket, round, imageUrl);
      const webhooks = await this.getActiveWebhooks();

      this.logger.log(
        `Publishing update for bracket ${bracket.slug} round ${round} to ${webhooks.length} Discord webhooks`,
      );

      for (const webhook of webhooks) {
        await this.sendToWebhook(
          webhook.url,
          embed,
          'bracket',
          bracketId,
          webhook.id,
        );
      }
    } catch (error) {
      this.logger.error('Error publishing phase announcement', error);
    }
  }

  private buildEmbed(
    bracket: any,
    round: number,
    imageUrl: string,
  ): DiscordEmbed {
    const matchCount = bracket.matches?.length || 0;
    const gameInfo = bracket.juego?.nombre || 'General';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (round === 999) {
      return {
        title: `👑 ¡TENEMOS CAMPEÓN! - ${bracket.tematica} 👑`,
        description: `¡El torneo ha finalizado! Conoce al ganador indiscutible.`,
        color: 0xffd700, // Gold
        fields: [
          { name: '🎮 Juego', value: gameInfo, inline: true },
          { name: '📊 Estado', value: 'FINALIZADO 🛑', inline: true },
        ],
        image: { url: imageUrl },
        footer: { text: '¡Gracias por participar en las votaciones!' },
        url: `${frontendUrl}/votaciones/${bracket.slug}`,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      title: `🏆 Nueva Ronda - ${bracket.tematica}`,
      description: `**Ronda ${round}** ha comenzado. ¡Vota por tus favoritos!`,
      color: 0x22c55e, // Verde primary
      fields: [
        { name: '🎮 Juego', value: gameInfo, inline: true },
        {
          name: '⚔️ Combates',
          value: `${matchCount} enfrentamientos`,
          inline: true,
        },
        { name: '📊 Estado', value: 'EN VIVO 🟢', inline: true },
      ],
      image: { url: imageUrl },
      footer: { text: '¡Tu voto decide el campeón!' },
      url: `${frontendUrl}/votaciones/${bracket.slug}`,
      timestamp: new Date().toISOString(),
    };
  }

  private async sendToWebhook(
    webhookUrl: string,
    embed: DiscordEmbed,
    entityType: string | 'bracket' | 'tutorial' | 'sorteo' | 'ranking',
    entityId: string,
    webhookId: string,
  ) {
    try {
      const decryptedUrl = webhookUrl;

      const response = await fetch(decryptedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (response.ok) {
        // Solo registramos en DB si es un bracket (bracketId y round son NOT NULL en el schema)
        // y si el webhook realmente existe en la base de datos (evitar error foreign key)
        if (entityType === 'bracket' && webhookId !== 'ENV_WEBHOOK') {
          await this.prisma.discordPublication.create({
            data: {
              webhookId,
              bracketId: entityId,
              round: 1,
              imageUrl: embed.image?.url,
              status: 'published',
              publishedAt: new Date(),
            },
          });
        }
        this.logger.log(
          `Published to webhook ${webhookId} (${entityType}: ${entityId})`,
        );
      } else {
        throw new Error(
          `Discord API error: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error: any) {
      if (entityType === 'bracket' && webhookId !== 'ENV_WEBHOOK') {
        await this.prisma.discordPublication.create({
          data: {
            webhookId,
            bracketId: entityId,
            round: 1,
            status: 'failed',
            error: error.message,
          },
        });
      }
      this.logger.error(
        `Failed to publish to webhook ${webhookId}: ${error.message}`,
      );
    }
  }
}
