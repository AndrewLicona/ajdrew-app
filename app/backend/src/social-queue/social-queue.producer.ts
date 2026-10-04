import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, JobsOptions } from 'bullmq';

/**
 * Tipos de payloads que acepta la cola social-publisher.
 * Cada plataforma recibe su payload especifico.
 *
 * Importante: usamos `evento` en lugar de `type` para evitar colision
 * con el campo homonimo de los JobData.
 */
export interface DiscordPayload {
  evento: 'tutorial' | 'sorteo_created' | 'sorteo_winners' | 'bracket_created' | 'bracket_phase' | 'bracket_champion' | 'ranking' | 'tabla';
  data: any;
  text: string;
  imageUrl?: string;
  imageBuffer?: Buffer;
}

export interface XPayload {
  evento: 'tutorial' | 'sorteo_created' | 'sorteo_winners' | 'bracket_created' | 'bracket_phase' | 'bracket_champion' | 'ranking' | 'tabla';
  data: any;
  text: string;
  imageBuffer?: Buffer;
}

export interface MetaPayload {
  evento: 'tutorial' | 'sorteo_created' | 'sorteo_winners' | 'bracket_created' | 'bracket_phase' | 'bracket_champion' | 'ranking' | 'tabla';
  data: any;
  text: string;
  imageUrl: string; // Cloudinary URL para Meta (necesario para FB/IG)
}

export interface YoutubePayload {
  evento: 'sorteo_created' | 'bracket_phase' | 'ranking';
  data: any;
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
}

export type SocialJobPayload =
  | DiscordPayload
  | XPayload
  | MetaPayload
  | YoutubePayload;

export interface SocialJobData {
  /** ID del SocialPublication para trazabilidad */
  publicationId: string;
  /** Plataforma destino */
  plataforma: 'discord' | 'x' | 'meta' | 'youtube';
  /** Payload especifico */
  payload: SocialJobPayload;
}

/**
 * Producer que encola publicaciones sociales para procesamiento asincrono.
 *
 * Sustituye a las llamadas directas `await this.xService.publish(...)` en los
 * listeners. Ahora los listeners hacen `enqueue()` y el consumer procesa
 * con reintentos automaticos.
 */
@Injectable()
export class SocialQueueProducer {
  private readonly logger = new Logger(SocialQueueProducer.name);

  constructor(
    @InjectQueue('social-publisher') private readonly queue: Queue<SocialJobData>,
  ) {}

  /**
   * Encola una publicacion para una plataforma especifica.
   *
   * Si se quiere reintentar un fallo manualmente, pasar `jobId = publicationId`
   * para deduplicar y reemplazar el job existente.
   */
  async enqueue(
    data: SocialJobData,
    options?: JobsOptions,
  ): Promise<void> {
    const jobId = options?.jobId || data.publicationId;
    try {
      const job = await this.queue.add('publish', data, {
        ...options,
        jobId,
      });
      this.logger.log(
        `Encolado ${data.plataforma} (job ${job.id}, attempt ${job.attemptsMade + 1})`,
      );
    } catch (error: any) {
      this.logger.error(`Error encolando ${data.plataforma}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Encola multiples plataformas en una sola operacion atomica.
   */
  async enqueueMany(items: SocialJobData[]): Promise<void> {
    await Promise.all(items.map((item) => this.enqueue(item)));
  }

  /**
   * Obtiene estadisticas de la cola (para dashboard admin).
   */
  async getStats() {
    const counts = await this.queue.getJobCounts();
    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0,
      paused: counts.paused || 0,
    };
  }

  /**
   * Reintenta un job fallido manualmente desde el dashboard.
   */
  async retryFailedJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} no encontrado en la cola`);
    }
    await job.retry();
  }
}