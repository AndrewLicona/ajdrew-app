
import { Module } from '@nestjs/common';
import { CalificacionesService } from './application/calificaciones.service';
import { CalificacionesController } from './interfaces/calificaciones.controller';
import { CalificacionRepository } from './infrastructure/persistence/calificacion.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ItemsCalificablesModule } from '../items-calificables/items-calificables.module';

@Module({
  imports: [PrismaModule, ItemsCalificablesModule],
  controllers: [CalificacionesController],
  providers: [CalificacionesService, CalificacionRepository],
  exports: [CalificacionesService, CalificacionRepository],
})
export class CalificacionesModule { }
