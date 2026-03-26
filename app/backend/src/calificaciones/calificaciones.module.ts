import { Module } from '@nestjs/common';
import { CalificacionesService } from './application/calificaciones.service';
import { CalificacionesController } from './interfaces/calificaciones.controller';
import { CalificacionRepository } from './infrastructure/persistence/calificacion.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ItemsCalificablesModule } from '../items-calificables/items-calificables.module';
import { MediaModule } from '../media/media.module';
import { RankingMediaService } from './application/ranking-media.service';
import { RankingImageGenerator } from './application/ranking-image-generator';

@Module({
  imports: [PrismaModule, ItemsCalificablesModule, MediaModule],
  controllers: [CalificacionesController],
  providers: [
    CalificacionesService,
    CalificacionRepository,
    RankingMediaService,
    RankingImageGenerator,
  ],
  exports: [CalificacionesService, CalificacionRepository, RankingMediaService],
})
export class CalificacionesModule {}
