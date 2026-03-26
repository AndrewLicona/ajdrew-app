import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VotacionesService } from '../votaciones.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VotacionesCronService {
  private readonly logger = new Logger(VotacionesCronService.name);

  constructor(
    private readonly votacionesService: VotacionesService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Checking for rounds to advance...');

    const now = new Date();
    const bracketsToAdvance = await this.prisma.votacionBracket.findMany({
      where: {
        estado: 'ACTIVA',
        proximoCierreAt: {
          lte: now,
        },
      } as any,
    });

    if (bracketsToAdvance.length === 0) return;

    this.logger.log(`Found ${bracketsToAdvance.length} brackets to advance.`);

    for (const bracket of bracketsToAdvance) {
      try {
        await this.votacionesService.advanceRound(bracket.id);
        this.logger.log(
          `Advanced round for bracket: ${bracket.tematica} (${bracket.id})`,
        );
      } catch (error) {
        this.logger.error(
          `Error advancing round for bracket ${bracket.id}: ${error.message}`,
        );
      }
    }
  }
}
