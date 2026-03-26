import { Module } from '@nestjs/common';
import { JuegosService } from './application/juegos.service';
import { JuegosController } from './interfaces/juegos.controller';
import { JuegoRepository } from './infrastructure/persistence/juego.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { CalificacionesModule } from '../calificaciones/calificaciones.module';

@Module({
  imports: [PrismaModule, CategoriasModule, CalificacionesModule],
  controllers: [JuegosController],
  providers: [JuegosService, JuegoRepository],
  exports: [JuegosService],
})
export class JuegosModule {}
