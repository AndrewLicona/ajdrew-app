import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SorteosService } from './sorteos.service';

@Injectable()
export class SorteosCron {
  private readonly logger = new Logger(SorteosCron.name);

  constructor(private readonly sorteosService: SorteosService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredSorteos() {
    this.logger.log('Revisando sorteos expirados...');
    const result = await this.sorteosService.cerrarSorteosExpirados();
    if (result.procesados > 0) {
      this.logger.log(`${result.procesados} sorteo(s) expirado(s) procesado(s)`);
    }
  }
}