import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { XService } from '../services/x.service';
import { MetaService } from '../services/meta.service';

/**
 * Cron que refresca las metricas de cada publicacion social.
 *
 * Cada dia a las 2am toma todas las publicaciones exitosas de los ultimos 7 dias
 * y consulta las APIs de cada plataforma para capturar:
 *  - X: likes, retweets, replies, impressions
 *  - Meta (FB/IG): likes, comments, shares, reach
 *  - YouTube: views, likes, comments (NUEVO en FASE 3)
 *
 * Las metricas se guardan en SocialAnalytics para mostrarlas en el dashboard.
 */
@Injectable()
export class AnalyticsCronService {
  private readonly logger = new Logger(AnalyticsCronService.name);

  constructor(
    private prisma: PrismaService,
    private xService: XService,
    private metaService: MetaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async refreshAnalytics() {
    this.logger.log('Iniciando refresh de analytics...');

    const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const publicaciones = await this.prisma.socialPublication.findMany({
      where: {
        estado: 'PUBLICADO',
        publicadoAt: { gte: hace7dias },
      },
      take: 200, // Limite por ejecucion para no saturar las APIs
    });

    let okCount = 0;
    let errCount = 0;

    for (const pub of publicaciones) {
      try {
        let metricas: any = null;

        if (pub.plataforma === 'x') {
          metricas = await this.xService.getTweetMetrics(pub.id);
        } else if (pub.plataforma === 'meta') {
          metricas = await this.metaService.getPostMetrics(pub.id);
        } else if (pub.plataforma === 'youtube') {
          // TODO Fase 3: anadir getVideoMetrics cuando se integre YouTube Analytics API
          continue;
        } else if (pub.plataforma === 'discord') {
          // Discord webhooks no tienen metricas publicas (a menos que se migre a bot)
          continue;
        }

        if (metricas) {
          await this.prisma.socialAnalytics.create({
            data: {
              publicationId: pub.id,
              plataforma: pub.plataforma,
              referenciaTipo: pub.referenciaTipo,
              referenciaId: pub.referenciaId,
              metricas,
            },
          });
          okCount++;
        }
      } catch (error: any) {
        this.logger.warn(
          `Error capturando metricas de ${pub.id}: ${error.message}`,
        );
        errCount++;
      }
    }

    this.logger.log(
      `Analytics refrescadas: ${okCount} OK, ${errCount} errores`,
    );
  }
}