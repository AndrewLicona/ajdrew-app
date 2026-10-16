import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SorteosService } from './sorteos.service';
import { SorteosController } from './interfaces/sorteos.controller';
import { SorteoRepository } from './infrastructure/persistence/sorteo.repository';
import { SorteosCron } from './sorteos.cron';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [SorteosController],
  providers: [SorteosService, SorteoRepository, SorteosCron],
  exports: [SorteosService],
})
export class SorteosModule {}
