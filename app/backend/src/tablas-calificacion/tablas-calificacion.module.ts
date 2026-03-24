import { Module } from '@nestjs/common';
import { TablasCalificacionService } from './tablas-calificacion.service';
import { TablasCalificacionController } from './tablas-calificacion.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TablasCalificacionController],
  providers: [TablasCalificacionService],
})
export class TablasCalificacionModule {}
