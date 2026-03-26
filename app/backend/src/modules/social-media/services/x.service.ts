import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class XService {
  private readonly logger = new Logger(XService.name);

  constructor(private prisma: PrismaService) {}

  async publishPhaseAnnouncement(
    bracketId: string,
    round: number,
    imageBuffer: Buffer,
  ) {
    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: bracketId },
        include: { juego: true },
      });

      if (!bracket) {
        this.logger.error(`Bracket not found for X publication: ${bracketId}`);
        return;
      }

      // 1. Get accounts from DB
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });

      // 2. Check for .env fallback account
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];

      if (envAccount) {
        // Add env account if not already in DB by some criteria or just always for safety
        allAccounts.push(envAccount);
      }

      if (allAccounts.length === 0) {
        this.logger.warn(
          'No active X accounts found for publication (DB or ENV)',
        );
        return;
      }

      const tweetText = this.buildTweetText(bracket, round);

      for (const account of allAccounts) {
        await this.sendTweet(
          account,
          tweetText,
          imageBuffer,
          'bracket',
          bracketId,
        );
      }
    } catch (error) {
      this.logger.error('Error publishing to X', error);
    }
  }

  private getEnvAccount() {
    if (
      process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_SECRET
    ) {
      return {
        id: 'env-account',
        name: process.env.X_ACCOUNT_NAME || '@AJDREWGameplays (ENV)',
        apiKey: process.env.X_API_KEY,
        apiSecret: process.env.X_API_SECRET,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_SECRET,
        isActive: true,
      } as any;
    }
    return null;
  }

  private buildTweetText(bracket: any, round: number): string {
    const gameEmoji = bracket.juego?.nombre?.includes('FC') ? '⚽' : '🎮';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (round === 999) {
      return (
        `👑 ¡TENEMOS CAMPEÓN! ${bracket.tematica} 👑\n\n` +
        `${gameEmoji} El torneo ha finalizado. Conoce al ganador indiscutible.\n\n` +
        `🏆 ¡Gracias por tus votos!\n` +
        `${frontendUrl}/votaciones/${bracket.slug}\n\n` +
        `@AJDREWGameplays #Campeon #EliteRankings #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
      );
    }

    return (
      `${gameEmoji} ¡NUEVA RONDA! ${bracket.tematica}\n\n` +
      `🔥 La Ronda ${round} ha comenzado en Elite Rankings.\n\n` +
      `🗳️ ¡Entra y vota por tus favoritos ahora!\n` +
      `${frontendUrl}/votaciones/${bracket.slug}\n\n` +
      `@AJDREWGameplays #EliteRankings #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private async sendTweet(
    account: any,
    text: string,
    imageBuffer: Buffer,
    entityType: string | 'bracket' | 'tutorial' | 'sorteo' | 'ranking',
    entityId: string,
  ) {
    try {
      const client = new TwitterApi({
        appKey: account.apiKey,
        appSecret: account.apiSecret,
        accessToken: account.accessToken,
        accessSecret: account.accessSecret,
      });

      // 1. Upload media
      const mediaId = await client.v1.uploadMedia(imageBuffer, { type: 'png' });

      // 2. Post tweet
      const tweet = await client.v2.tweet({
        text: text,
        media: { media_ids: [mediaId] },
      });

      if (tweet.data) {
        // Solo registramos en DB si es un bracket y la cuenta existe en DB
        if (entityType === 'bracket' && account.id !== 'env-account') {
          await this.prisma.xPublication.create({
            data: {
              accountId: account.id,
              bracketId: entityId,
              round: 1,
              tweetId: tweet.data.id,
              status: 'published',
              publishedAt: new Date(),
            },
          });
        }
        this.logger.log(
          `Tweet published successfully for account: ${account.name} (${entityType}: ${entityId})`,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to post tweet for account ${account.id}: ${error.message}`,
      );
      if (entityType === 'bracket' && account.id !== 'env-account') {
        await this.prisma.xPublication.create({
          data: {
            accountId: account.id,
            bracketId: entityId,
            round: 1,
            status: 'failed',
            error: error.message,
          },
        });
      }
    }
  }

  async publishMatchResult(
    bracketId: string,
    round: number,
    imageBuffer: Buffer,
    winnerName: string,
  ) {
    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: bracketId },
        include: { juego: true },
      });

      if (!bracket) return;

      // 1. Get accounts
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];
      if (envAccount) allAccounts.push(envAccount);

      if (allAccounts.length === 0) return;

      const text =
        `🏆 ¡RESULTADO FINAL! ${bracket.tematica}\n\n` +
        `✨ ${winnerName} ha ganado su combate en la Ronda ${round}.\n\n` +
        `🗳️ Sigue el torneo en:\n` +
        `${process.env.FRONTEND_URL || 'https://ajdrew.site'}/votaciones/${bracket.slug}\n\n` +
        `@AJDREWGameplays #EliteRankings #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`;

      for (const account of allAccounts) {
        await this.sendTweet(account, text, imageBuffer, 'bracket', bracketId);
      }
    } catch (error) {
      this.logger.error('Error in X publication process (Result)', error);
    }
  }

  async publishTutorial(tutorial: any, text: string, imageUrl: string) {
    try {
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];
      if (envAccount) allAccounts.push(envAccount);

      if (allAccounts.length === 0) return;

      // Descargar imagen si es URL
      let imageBuffer: Buffer | null = null;
      if (imageUrl) {
        try {
          const res = await fetch(imageUrl);
          if (res.ok) {
            imageBuffer = Buffer.from(await res.arrayBuffer());
          }
        } catch (e) {
          this.logger.warn('Failed to download tutorial image for X');
        }
      }

      for (const account of allAccounts) {
        if (imageBuffer) {
          await this.sendTweet(
            account,
            text,
            imageBuffer,
            'tutorial',
            tutorial.id,
          );
        } else {
          // Tweet sin imagen
          await this.sendTextTweet(account, text, 'tutorial', tutorial.id);
        }
      }
    } catch (error) {
      this.logger.error('Error publishing tutorial to X', error);
    }
  }

  async publishSorteoCreated(sorteo: any, text: string, imageBuffer: Buffer) {
    try {
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];
      if (envAccount) allAccounts.push(envAccount);

      if (allAccounts.length === 0) return;

      for (const account of allAccounts) {
        await this.sendTweet(account, text, imageBuffer, 'sorteo', sorteo.id);
      }
    } catch (error) {
      this.logger.error('Error publishing sorteo created to X', error);
    }
  }

  async publishSorteoWinners(
    sorteo: any,
    text: string,
    imageBuffer: Buffer,
    winnerNames: string[],
  ) {
    try {
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];
      if (envAccount) allAccounts.push(envAccount);

      if (allAccounts.length === 0) return;

      for (const account of allAccounts) {
        await this.sendTweet(account, text, imageBuffer, 'sorteo', sorteo.id);
      }
    } catch (error) {
      this.logger.error('Error publishing sorteo winners to X', error);
    }
  }

  async publishRanking(categoria: any, text: string, imageBuffer: Buffer) {
    try {
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];
      if (envAccount) allAccounts.push(envAccount);

      if (allAccounts.length === 0) return;

      for (const account of allAccounts) {
        await this.sendTweet(
          account,
          text,
          imageBuffer,
          'ranking',
          categoria.id,
        );
      }
    } catch (error) {
      this.logger.error('Error publishing ranking to X', error);
    }
  }

  async publishBracketCreated(bracket: any, text: string, imageBuffer: Buffer) {
    try {
      const dbAccounts = await this.prisma.xAccount.findMany({
        where: { isActive: true },
      });
      const envAccount = this.getEnvAccount();
      const allAccounts = [...dbAccounts];
      if (envAccount) allAccounts.push(envAccount);

      if (allAccounts.length === 0) return;

      for (const account of allAccounts) {
        await this.sendTweet(
          account,
          text,
          imageBuffer,
          'bracket-announce',
          bracket.id,
        );
      }
    } catch (error) {
      this.logger.error('Error publishing bracket created to X', error);
    }
  }

  private async sendTextTweet(
    account: any,
    text: string,
    entityType: string,
    entityId: string,
  ) {
    try {
      const client = new TwitterApi({
        appKey: account.apiKey,
        appSecret: account.apiSecret,
        accessToken: account.accessToken,
        accessSecret: account.accessSecret,
      });

      const tweet = await client.v2.tweet({ text });

      if (tweet.data) {
        // Solo registramos en DB si es un bracket
        if (entityType === 'bracket') {
          await this.prisma.xPublication.create({
            data: {
              accountId: account.id,
              bracketId: entityId,
              round: 1,
              tweetId: tweet.data.id,
              status: 'published',
              publishedAt: new Date(),
            },
          });
        }
        this.logger.log(`Text tweet published for account: ${account.name}`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to post text tweet: ${error.message}`);
      if (entityType === 'bracket') {
        await this.prisma.xPublication.create({
          data: {
            accountId: account.id,
            bracketId: entityId,
            round: 1,
            status: 'failed',
            error: error.message,
          },
        });
      }
    }
  }

  // For manual testing/admin
  async testTweet(accountId: string) {
    const account = await this.prisma.xAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new Error('Account not found');

    const client = new TwitterApi({
      appKey: account.apiKey,
      appSecret: account.apiSecret,
      accessToken: account.accessToken,
      accessSecret: account.accessSecret,
    });

    const tweet = await client.v2.tweet(
      `🚀 Test de Integración X (Twitter) para @AJDREWGameplays\n\nSi ves esto, la conexión desde Elite Rankings funciona correctamente! ✅`,
    );
    return { success: !!tweet.data, tweetId: tweet.data?.id };
  }
}
