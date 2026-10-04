import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SocialJobData } from '../social-queue.producer';
import { PrismaService } from '../../prisma/prisma.service';
import { DiscordService } from '../../modules/social-media/services/discord.service';
import { XService } from '../../modules/social-media/services/x.service';
import { MetaService } from '../../modules/social-media/services/meta.service';
import { YoutubeService } from '../../modules/social-media/services/youtube.service';

/**
 * Worker que procesa publicaciones sociales con reintentos automaticos.
 *
 * Configuracion (definida en SocialQueueModule):
 *  - attempts: 5
 *  - backoff: exponencial 30s, 1m, 2m, 4m, 8m
 *  - concurrency: 3 (max 3 jobs en paralelo)
 *
 * Por cada job:
 *  1. Llama al servicio de la plataforma correspondiente.
 *  2. Si tiene exito -> marca SocialPublication como PUBLICADO.
 *  3. Si falla -> actualiza el contador de intentos y deja que BullMQ reintente.
 *  4. Si se agotan los reintentos -> marca SocialPublication como FALLIDO.
 */
@Processor('social-publisher', { concurrency: 3 })
export class SocialPublisherProcessor extends WorkerHost {
  private readonly logger = new Logger(SocialPublisherProcessor.name);

  constructor(
    private prisma: PrismaService,
    private discord: DiscordService,
    private x: XService,
    private meta: MetaService,
    private youtube: YoutubeService,
  ) {
    super();
  }

  async process(job: Job<SocialJobData>): Promise<any> {
    const { publicationId, plataforma, payload } = job.data;
    const attempt = job.attemptsMade + 1;
    const maxAttempts = job.opts.attempts || 5;

    this.logger.log(
      `Procesando ${plataforma} (intento ${attempt}/${maxAttempts}, job ${job.id})`,
    );

    // Marcar como PENDIENTE si es el primer intento
    if (attempt === 1) {
      await this.prisma.socialPublication
        .update({
          where: { id: publicationId },
          data: { estado: 'PENDIENTE', intentos: 1, errorMsg: null },
        })
        .catch(() => {
          // Puede que no haya registro (job lanzado fuera de SocialPublication)
        });
    }

    try {
      // Despachar al servicio de la red social
      switch (plataforma) {
        case 'discord':
          await this.handleDiscord(payload);
          break;
        case 'x':
          await this.handleX(payload);
          break;
        case 'meta':
          await this.handleMeta(payload);
          break;
        case 'youtube':
          await this.handleYoutube(payload);
          break;
        default:
          throw new Error(`Plataforma desconocida: ${plataforma}`);
      }

      // Exito -> marcar PUBLICADO
      await this.prisma.socialPublication
        .update({
          where: { id: publicationId },
          data: {
            estado: 'PUBLICADO',
            publicadoAt: new Date(),
            intentos: attempt,
            errorMsg: null,
          },
        })
        .catch(() => {});

      this.logger.log(
        `[OK] ${plataforma} publicado correctamente (job ${job.id})`,
      );
      return { success: true, attempt, plataforma };
    } catch (error: any) {
      const isLastAttempt = attempt >= maxAttempts;

      await this.prisma.socialPublication
        .update({
          where: { id: publicationId },
          data: {
            estado: isLastAttempt ? 'FALLIDO' : 'PENDIENTE',
            intentos: attempt,
            errorMsg: error.message?.slice(0, 500),
          },
        })
        .catch(() => {});

      this.logger.error(
        `[FAIL] ${plataforma} intento ${attempt}/${maxAttempts}: ${error.message}`,
      );

      // Si es el ultimo intento, no reintentar
      if (isLastAttempt) {
        this.logger.error(
          `Agotados los ${maxAttempts} intentos para ${plataforma} (job ${job.id})`,
        );
        // Lanzamos el error para que BullMQ no reintente mas
        throw error;
      }

      // Lanzamos el error para que BullMQ aplique el backoff
      throw error;
    }
  }

  /**
   * Publica en Discord via webhook.
   */
  private async handleDiscord(payload: any): Promise<void> {
    const { evento, data, text, imageUrl, imageBuffer } = payload;

    switch (evento) {
      case 'tutorial':
        await this.discord.publishTutorial(data, text, imageUrl || '');
        break;
      case 'sorteo_created':
        await this.discord.publishSorteoCreated(data, text, imageBuffer);
        break;
      case 'sorteo_winners':
        await this.discord.publishSorteoWinners(
          data,
          text,
          imageBuffer,
          data.ganadores || [],
        );
        break;
      case 'bracket_created':
        await this.discord.publishPhaseAnnouncement(
          data.bracketId || data.id,
          1,
          imageUrl,
        );
        break;
      case 'bracket_phase':
        await this.discord.publishPhaseAnnouncement(
          data.bracketId || data.id,
          data.round || 1,
          imageUrl,
        );
        break;
      case 'bracket_champion':
        await this.discord.publishPhaseAnnouncement(
          data.bracketId || data.id,
          999,
          imageUrl,
        );
        break;
      case 'ranking':
      case 'tabla':
        await this.discord.publishRanking(data, text, imageUrl);
        break;
      default:
        throw new Error(`Evento Discord no soportado: ${evento}`);
    }
  }

  /**
   * Publica tweet en X / Twitter con imagen.
   */
  private async handleX(payload: any): Promise<void> {
    const { evento, data, text, imageBuffer } = payload;

    switch (evento) {
      case 'tutorial':
        await this.x.publishTutorial(data, text, imageBuffer || '');
        break;
      case 'sorteo_created':
        await this.x.publishSorteoCreated(data, text, imageBuffer);
        break;
      case 'sorteo_winners':
        await this.x.publishSorteoWinners(
          data,
          text,
          imageBuffer,
          data.ganadores || [],
        );
        break;
      case 'bracket_created':
      case 'bracket_phase':
        await this.x.publishBracketCreated(data, text, imageBuffer);
        break;
      case 'bracket_champion':
        await this.x.publishMatchResult(
          data.bracketId || data.id,
          999,
          imageBuffer,
          data.ganadorNombre || data.premioItem || 'Ganador',
        );
        break;
      case 'ranking':
      case 'tabla':
        await this.x.publishRanking(data, text, imageBuffer);
        break;
      default:
        throw new Error(`Evento X no soportado: ${evento}`);
    }
  }

  /**
   * Publica en Facebook e Instagram (Meta).
   * Requiere URL publica de Cloudinary (no Buffer).
   */
  private async handleMeta(payload: any): Promise<void> {
    const { evento, data, text, imageUrl } = payload;

    switch (evento) {
      case 'tutorial':
        await this.meta.publishTutorial(data, text, imageUrl);
        break;
      case 'sorteo_created':
        await this.meta.publishSorteoCreated(data, text, imageUrl);
        break;
      case 'sorteo_winners':
        await this.meta.publishSorteoWinners(
          data,
          text,
          imageUrl,
          data.ganadores || [],
        );
        break;
      case 'bracket_created':
        await this.meta.publishBracketCreated(data, text, imageUrl);
        break;
      case 'bracket_phase':
        await this.meta.publishPhaseAnnouncement(
          data.bracketId || data.id,
          data.round || 1,
          imageUrl,
        );
        break;
      case 'bracket_champion':
        await this.meta.publishMatchResult(
          data.bracketId || data.id,
          999,
          imageUrl,
          data.ganadorNombre || data.premioItem || 'Ganador',
        );
        break;
      case 'ranking':
      case 'tabla':
        await this.meta.publishRanking(data, text, imageUrl);
        break;
      default:
        throw new Error(`Evento Meta no soportado: ${evento}`);
    }
  }

  /**
   * Sube Short o video a YouTube a partir de una imagen o evento.
   */
  private async handleYoutube(payload: any): Promise<void> {
    const { evento, data, imageUrl, title, description, tags } = payload;

    if (evento === 'sorteo_created' || evento === 'ranking') {
      await this.youtube.publishVideoFromImage(
        imageUrl,
        title || `¡Novedad en AJDREW! - ${data?.titulo || data?.nombre || ''}`,
        description || `Participa y vota en AJDREW.`,
        tags || ['Gaming', 'AJDREW'],
        data,
      );
    } else if (evento === 'bracket_phase') {
      await this.youtube.publishPhaseAnnouncement(
        data.bracketId || data.id,
        data.round || 1,
        imageUrl,
      );
    } else {
      this.logger.log(`YouTube omitido para evento ${evento}`);
    }
  }
}