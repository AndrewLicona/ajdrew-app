import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStudioService } from './content-studio.service';

/**
 * Cron job que procesa las publicaciones PROGRAMADAS cuya fecha ya pasó.
 *
 * Cada minuto busca en SocialPublication todas las que estén en estado=PROGRAMADO
 * y cuya programadoPara <= ahora, y las reencola cambiando su estado a PENDIENTE.
 * Los listeners sociales existentes se encargan del resto.
 */
@Injectable()
export class ScheduledPublicationsCron {
  private readonly logger = new Logger(ScheduledPublicationsCron.name);

  constructor(
    private prisma: PrismaService,
    private studio: ContentStudioService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledPublications() {
    const now = new Date();
    const due = await this.prisma.socialPublication.findMany({
      where: {
        estado: 'PROGRAMADO',
        programadoPara: { lte: now },
      },
      take: 50, // Procesar en lotes para no saturar
    });

    if (due.length === 0) return;

    this.logger.log(
      `Procesando ${due.length} publicación(es) programadas`,
    );

    for (const pub of due) {
      try {
        // Marcar como PENDIENTE — los listeners la procesarán
        await this.prisma.socialPublication.update({
          where: { id: pub.id },
          data: { estado: 'PENDIENTE' },
        });

        // Reintentar la publicación
        await this.studio.retryPublication(pub.id);
      } catch (error: any) {
        this.logger.error(
          `Error procesando publicación ${pub.id}: ${error.message}`,
        );
      }
    }
  }
}