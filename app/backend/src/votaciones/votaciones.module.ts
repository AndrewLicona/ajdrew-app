import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { VotacionesService } from './votaciones.service';
import { VotacionesController } from './interfaces/votaciones.controller';
import { VotacionRepository } from './infrastructure/persistence/votacion.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { VotacionesCronService } from './application/votaciones-cron.service';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';

@Module({
    imports: [PrismaModule, ScheduleModule.forRoot(), PublicacionesModule],
    controllers: [VotacionesController],
    providers: [VotacionesService, VotacionRepository, VotacionesCronService],
    exports: [VotacionesService],
})
export class VotacionesModule { }
