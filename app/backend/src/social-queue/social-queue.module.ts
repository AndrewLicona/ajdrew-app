import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SocialPublisherProcessor } from './workers/social-publisher.processor';
import { SocialQueueProducer } from './social-queue.producer';
import { PrismaService } from '../prisma/prisma.service';
import { SocialMediaModule } from '../modules/social-media/social-media.module';

/**
 * Modulo que encapsula la cola BullMQ para publicaciones sociales.
 *
 * Cola: `social-publisher`
 * - concurrency: 3 (procesa 3 publicaciones en paralelo)
 * - reintentos: 5 con backoff exponencial (30s, 1m, 2m, 4m, 8m)
 *
 * Los listeners existentes siguen emitiendo los eventos `social.*` y `bracket.*`.
 * Ahora, en lugar de publicar directamente, encolan un job en esta cola.
 * El consumer procesa el job y maneja reintentos automaticamente.
 *
 * Variables de entorno:
 *  - REDIS_HOST (default: localhost)
 *  - REDIS_PORT (default: 6379)
 *
 * NOTA: Hay una dependencia circular con SocialMediaModule (este modulo
 * necesita los services de social-media, y social-media necesita el producer
 * de este modulo para los listeners). Se resuelve con forwardRef.
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'social-publisher',
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 30_000, // 30 segundos, luego 1m, 2m, 4m, 8m
        },
        removeOnComplete: 100, // mantener los ultimos 100 completados
        removeOnFail: 500,     // mantener los ultimos 500 fallidos
      },
    }),
    // Importamos SocialMediaModule (con forwardRef para evitar ciclo) para que el
    // worker pueda llamar a DiscordService, XService, MetaService, YoutubeService.
    forwardRef(() => SocialMediaModule),
  ],
  providers: [
    SocialQueueProducer,
    SocialPublisherProcessor,
    PrismaService,
  ],
  exports: [SocialQueueProducer],
})
export class SocialQueueModule {}