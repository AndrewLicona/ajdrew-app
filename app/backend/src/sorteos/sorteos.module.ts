import { Module } from '@nestjs/common';
import { SorteosService } from './sorteos.service';
import { SorteosController } from './interfaces/sorteos.controller';
import { SorteoRepository } from './infrastructure/persistence/sorteo.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SorteosController],
  providers: [SorteosService, SorteoRepository],
  exports: [SorteosService],
})
export class SorteosModule {}
